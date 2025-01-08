import axios from "axios";

export async function GET(req) {
    
    const studentId = req.nextUrl.searchParams.get("studentId");
    const question= req.nextUrl.searchParams.get("question");
    var roleData = {
        'role': 'student',
        'user_id': studentId,
    }
    const formData = new FormData();
    formData.append('userInput', question);
    formData.append('userContext',JSON.stringify(roleData));
 
    const response = await axios.post("https://cygnosislabs.in/", formData);
    // const response = await axios.post("http://127.0.0.1:5000/", formData);

    return Response.json(response.data);
}