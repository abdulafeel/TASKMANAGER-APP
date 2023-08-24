const initialState = {
  users: [], 
  isLoggedIn: false,
  user: {},
  errorMessage: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_USER':
      if (!state.isLoggedIn) {
     
        const emailExists = state.users.some(
          (user) => user.email === action.payload.email
        );
    
        if (emailExists) {
          return {
            ...state,
            errorMessage: 'Email already exists',
          };
        }
      }
    
      return {
        ...state,
        users: [...state.users, action.payload],
        errorMessage: '',
    };
    case 'LOGIN_USER':
      const { email, password } = action.payload;
      const foundUser = state.users.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        return {
          ...state,
          isLoggedIn: true,
          user: foundUser,
          errorMessage: '',
        };
      } else {
        return {
          ...state,
          isLoggedIn: false,
          errorMessage: 'Invalid email or password',
        };
      }

      case 'CLEAR_ERROR_MESSAGE':
  return {
    ...state,
    errorMessage: '',
  };

    case 'LOGOUT_USER':
      return {
        ...state,
        isLoggedIn: false,
        user: {},
        errorMessage: '',
      };
    default:
      return state;
  }
};

export default authReducer;
