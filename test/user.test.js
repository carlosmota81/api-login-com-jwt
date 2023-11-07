let app = require("../src/app")
let supertest = require("supertest");
let request = supertest(app);

let mainUser = {nome: "Icaro", email: "icaro@mota.com", password:"123456"}


beforeAll(()=>{

    return request.post("/user")
    .send(mainUser)
    .then(res=>{

    }).catch(err =>{
        console.log(err)
    })
})

afterAll(()=>{

    return request.delete(`/user/${mainUser.email}`)
    .then(res =>{})
    .catch(err=>{console.log(err)})
})




describe("Cadastro de usuário",()=>{
    test("Deve cadastrar o usuário com sucesso",()=>{

        let time = Date.now();
        let email = `${time}@gmail.com`;

        let user = {name: "Carlos", email ,password:"1234"};

        return request.post("/user")
        .send(user).then(res=>{

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email)

        }).catch(err=>{
            console.log(err);
        })

    })

    test("Deve impedir que o usuario se cadastre com os dados vazios",()=>{

        

        let user = {name: "", email:"" ,password:""};

        return request.post("/user")
        .send(user).then(res=>{

            expect(res.statusCode).toEqual(400);
            expect(res.body.email).toEqual(email)

        }).catch(err=>{
            console.log(err);
        })
    })


    test("Deve impedir que um usuário se cadastre com e-mail repetido", ()=>{

        let time = Date.now();
        let email = `${time}@gmail.com`;

        let user = {name: "Carlos", email ,password:"1234"};

        return request.post("/user")
        .send(user).then(res=>{

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email)

            request.post("/user")
            .send(user)
            .then(res =>{
                expect(res.statusCode).toEqual(400)
                expect(res.body).toEqual("Email já cadastrado")
            }).catch(err=>{
                console.error(err)
            })

        }).catch(err=>{
            console.log(err);
        })

    })



})


describe("Autenticação",()=>{

    test("Deve me retornar um token quando logar",()=>{
        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res=>{
            expect(res.statusCode).toEqual(200)
            expect(res.body.token).toBeDefined()
        }).catch(err=>{
            console.log(err)
           
        })
    })


    test("Deve impedir que usuário não cadastrado se logue", ()=>{

        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res=>{
            expect(res.statusCode).toEqual(403)
            expect(res.body.errors.email).toEqual("E-mail não cadastrado!")
        }).catch(err=>{
            console.log(err)
           
        })

    })


    
    test("Deve impedir que usuário  se logue com senha errada", ()=>{

        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res=>{
            expect(res.statusCode).toEqual(403)
            expect(res.body.errors.password).toEqual("Senha incorreta!")
        }).catch(err=>{
            console.log(err)
           
        })

    })
})