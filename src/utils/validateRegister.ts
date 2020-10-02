import { UserPwdInput } from "src/resolvers/UserPwdInput";

export const validateRegister = (options:UserPwdInput) => {
    if(!options.email.includes("@")){
        return [
              {
                field: "email",
                message: "invalid email address"
              },
            ]
      }
    if (options.username.length <= 2) {
      return [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ]
    }
    if (options.username.includes("@")) {
        return [
            {
              field: "username",
              message: "cannot include special chars",
            },
          ]
      }
    if (options.password.length <= 2) {
      return [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ]
    }

    return null;
}