import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {email, password} = await request.json();

    if(!email || !password){
        return NextResponse.json({message: "Email e senha obrigatórios"}, {status:400});
    }
    
    if (email === "admin@fiap.com" && password === "fiap123"){
        return NextResponse.json({token:"fiap-admin-token"}, {status:200});
    }
    return NextResponse.json({message: "Credenciais inválidas"}, {status:401});
}