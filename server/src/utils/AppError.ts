// Quanto estendemos uma classe temos que chamar super() para chamar o constructor da função pai
// Aqui, "message" é o único parâmetro que a função built-in "Error" aceita
// interface AppError {
//     statusCode : number,
//     status: string,
//     isOperational: boolean
// }

// class AppError extends Error {
//     constructor(message:string, statusCode:number) {
//         super(message)

//         this.statusCode = statusCode
//         this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
//         this.isOperational = true

//         Error.captureStackTrace(this, this.constructor)
//     }
// }

// export default AppError