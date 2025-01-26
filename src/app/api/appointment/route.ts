import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises';
import path from 'path';


const databasePath = path.join(process.cwd(), 'src', 'database.json');

// comman funciton to read the database file and return its contents
async function readDatabase() {
  try {
    const databaseContents = await fs.readFile(databasePath, 'utf-8');
    return databaseContents ? JSON.parse(databaseContents) : [];
  } catch (error:unknown) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// comman function to write the updated data back to the database file
async function writeDatabase(data: Record<string, string>[]) {
  try {
    await fs.writeFile(databasePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}


// get
export async function GET() {
  try {

    const _appointmentsData = await readDatabase();

    return NextResponse.json(
      {
        appointments: _appointmentsData,
        success: true
      },
      { status: 200 }
    );

  } catch (err) {
    console.log(err)
    return NextResponse.json(
      {
        message: "Network error.",
        success: false
      },
      { status: 500 }
    );
  }
}

// add
export async function POST(req: NextRequest) {
  try {

    const uuid = crypto.randomUUID();
    const _clientFormData = await req.json();
    const _appointmentsData = await readDatabase();
    // Write the updated database back to the file
    await writeDatabase([..._appointmentsData, { ..._clientFormData, uuid }]);

    return NextResponse.json(
      {
        message: "You have successfully booked an appointment.",
        success: true
      },
      { status: 200 }
    );

  } catch (err) {
    console.log(err)
    return NextResponse.json(
      {
        message: "Network error.",
        success: false
      },
      { status: 500 }
    );
  }
}

// udpate
export async function PUT(req: NextRequest) {
  try {
    // const uuid = req.nextUrl.searchParams.get('uuid');

    const _clientFormData = await req.json();
    if (!_clientFormData?.uuid) {
      return NextResponse.json(
        {
          message: "UUID missing.",
          success: false,
        },
        { status: 400 }
      );
    }

    const _appointmentsData = await readDatabase();
    // find Index
    const isFoundInx = _appointmentsData?.findIndex((entry: Record<string, string>) => entry.uuid === _clientFormData?.uuid)

    if (isFoundInx >= 0) {
      _appointmentsData[isFoundInx] = { ..._clientFormData }
      await writeDatabase(_appointmentsData);
      return NextResponse.json(
        {
          message: `${_clientFormData?.first_name || ''} you have successfully udpated your appointment.`,
          success: true
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Appointment not found.",
          success: false,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      {
        message: "Network error.",
        success: false
      },
      { status: 500 }
    );
  }
}

// delete
export async function DELETE(req: NextRequest) {
  try {

    const uuid = req.nextUrl.searchParams.get('uuid');
    if (!uuid) {
      return NextResponse.json(
        {
          message: "UUID missing",
          success: false,
        },
        { status: 400 }
      );
    }

    const _appointmentsData = await readDatabase();

    // find the data using uuid
    let isFound: Record<string, string> = {};
    let isFoundInx = -1;
    _appointmentsData?.forEach((entry: Record<string, string>, index: number) => {
      if (entry.uuid === uuid) {
        isFound = entry;
        isFoundInx = index;
        return;
      }
    });

    if (isFoundInx >= 0) {
      _appointmentsData[isFoundInx] = { ...isFound, status: 'cancelled' }
      await writeDatabase(_appointmentsData);
      return NextResponse.json(
        {
          message: `${isFound?.first_name || ''} you have successfully cancelled your appointment.`,
          success: true
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Appointment not found.",
          success: false,
        },
        { status: 404 }
      );
    }


  } catch (err) {
    console.log(err)
    return NextResponse.json(
      {
        message: "Network error.",
        success: false
      },
      { status: 500 }
    );
  }
}