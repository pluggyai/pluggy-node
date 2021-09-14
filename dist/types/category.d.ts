export declare type Category = {
    /** primary identifier of the category */
    id: string;
    /** Category's name or description. */
    description: string;
    /** Parent category hierachy primary identifier */
    parentId?: string;
    /** Parent category hierachy name or description */
    parentDescription?: string;
};
