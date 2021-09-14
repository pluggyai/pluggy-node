export declare type ValidationError = {
    code: string;
    message: string;
    parameter: string;
};
export declare type ValidationResult = {
    parameters: Record<string, string>;
    errors: ValidationError[];
};
