import { NextResponse, NextRequest} from "next/server";
const protected_page_routes=['/dashboard', '/profile']
const protected_api_routes = ['api/save','api/recommend','api/profile']

export default async function middleware(request: NextRequest){
    //get current user 
    const token = request.cookies.get('token')?.value;
    const isProcdApi = protected_api_routes.some((path) => request.nextUrl.pathname.includes(path))
    const isProcdPage = protected_page_routes.some((path) => request.nextUrl.pathname.includes(path))
    const homepage = new URL('/', request.url)


    // console.log("middleware running")

    if(!token){
        // console.log("no token")
        // console.log(`checking route: ${request.url}`)
        // console.log(`is protected api: ${isProcdApi}`)
        if(isProcdApi){
            return new NextResponse("Unauthorized: No token provided",{
                status:401
            })
        }
        // console.log(`is protected page: ${isProcdPage}`)
        if(isProcdPage){
            return NextResponse.redirect(homepage)
        }
    }
    else{
        console.log("we have a cookie/token")
    }
    // }else{
    //     //we have a valid token
    //     try{
    //         jwt.verify(token, process.env.TOKEN_SECRET);
    //         console.log("we have token")
    //     }catch (error){
    //         if(isProcdApi){
    //             return new NextResponse("Unauthorized: Token is invalid or expired",{
    //                 status:401
    //             })
    //         }
    //         if(isProcdPage){
    //             return NextResponse.redirect(homepage)
    //         }
    //     }
    // }
    return NextResponse.next();
}


// export const config ={
// matcher: ['api/save']
// }
