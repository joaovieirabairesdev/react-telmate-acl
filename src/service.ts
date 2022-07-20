import axios from 'axios'

export type ACLControls = {
    id: number
    subject_type: string
    subject_key: string
    acl_role_id: number
    control: string
    lever: number
}

export type ACLServiceProps = {
    acl_endpoint: string
    jwtToken: string
}

export class ACLServiceError extends Error {
    constructor(message: string) {
        super(message)

        this.name = 'ACLServiceError'
    }
}

const LS_ACL_KEY = 'user-acls'

export class ACLService {

    props: ACLServiceProps

    static ACL_INHERIT = 0
    static ACL_DENY = 1
    static ACL_READ = 2
    static ACL_EDIT = 3

    constructor(props: ACLServiceProps) {
        this.props = props
    }

    async load(force?: false) {
        if (!this.props.acl_endpoint) {
            throw new ACLServiceError('No endpoint provided')
        }

        if (!this.props.jwtToken) {
            throw new ACLServiceError('No token provided')
        }

        let acls = this.getAcls()

        if (acls && acls?.length > 0 && !force) {
            return
        }

        try {
            const { data: response } = await axios.get(this.props.acl_endpoint, { headers: { Authorization: `Bearer ${this.props.jwtToken}` } })

            const acls = response.acl_effective_controls

            localStorage.setItem(LS_ACL_KEY, JSON.stringify(acls))

        } catch (e) {
            throw new ACLServiceError(`Error when trying to get ACLs ${JSON.stringify(e)}`)
        }
    }

    clear() {
        localStorage.removeItem(LS_ACL_KEY)
    }

    getAcls(): ACLControls[] {
        let acls = localStorage.getItem(LS_ACL_KEY) || '[]'

        return JSON.parse(acls)
    }
}