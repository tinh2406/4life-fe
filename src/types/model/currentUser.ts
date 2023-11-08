export interface CurrentUser {
    login: {
        currentUser: null;
        isFetching: boolean;
        error: boolean;
    },
    logout: {
        isFetching: boolean;
        error: boolean;
    },
    updatePass: {
        currentUser: null;
    },
    register: {
        currentUser: null;
        isFetching: boolean;
        error: boolean;
    }
}