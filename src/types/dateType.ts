type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type CreateDateResetType = {
    setDateChange: (date: Date) => void;
};

export type CreateResetType = {
    handleResetForm: () => void;
};
