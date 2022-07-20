import React from 'react';
import { ACLControls, ACLService } from './service';
export declare type ACLProviderProps = {
    children: React.ReactNode;
    aclService: ACLService;
};
export declare type ACLProviderData = {
    loading: boolean;
    get: () => ACLControls[];
    clear: () => void;
};
declare const ACLContext: React.Context<ACLProviderData>;
export declare const ACLProvider: React.FC<ACLProviderProps>;
export declare const useACL: () => ACLProviderData;
export default ACLContext;
