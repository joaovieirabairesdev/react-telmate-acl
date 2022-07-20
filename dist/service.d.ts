export declare type ACLControls = {
    id: number;
    subject_type: string;
    subject_key: string;
    acl_role_id: number;
    control: string;
    lever: number;
};
export declare type ACLServiceProps = {
    acl_endpoint: string;
    jwtToken: string;
};
export declare class ACLServiceError extends Error {
    constructor(message: string);
}
export declare class ACLService {
    props: ACLServiceProps;
    static ACL_INHERIT: number;
    static ACL_DENY: number;
    static ACL_READ: number;
    static ACL_EDIT: number;
    constructor(props: ACLServiceProps);
    load(force?: false): Promise<void>;
    clear(): void;
    getAcls(): ACLControls[];
}
