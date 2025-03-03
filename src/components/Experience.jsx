
"use client"
import { Canvas } from "@react-three/fiber"
import {
    CameraControls,
    Environment,
    Float,
    Gltf,
    Html,
    Loader,
    useGLTF
} from "@react-three/drei"
import { Teacher } from "./Teacher";
import { useAITeacher } from "@/hooks/useAITeacher";
import { TypingBox } from "./TypingBox";
import { MessagesList } from "./MessagesList";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";


const itemPlacement = {
    default: {
        classroom: {
            position: [0.2, -1.7, -2],
        },
        teacher: {
            position: [-1, -1.7, -3],
        },
        board: {
            position: [-0.8, 4, -6],
        },
    }
};


export const Experience = () => {
    const teacher = useAITeacher((state) => state.teacher);
    const classroom = useAITeacher((state) => state.classroom);

    const searchParams = useSearchParams();
    const studentId = searchParams.get('id');
    const role = 'student';

    const setStudentData = useAITeacher((state) => state.setStudentData);

    useEffect(() => {
        setStudentData(studentId);
    }, [studentId, setStudentData]);


    return (
        <>
            <div className="md:justify-center fixed bottom-1 left-1 right-1 flex gap-3 flex-wrap justify-stretch" style={{ zIndex: "99999999" }}>
                <TypingBox />
            </div >
            <Canvas camera={{
                position: [0, 0, 1],
            }}>
                <CameraManager />
                <Html fullscreen={true}>
                    <MessagesList />
                </Html>
                <Environment preset="sunset" />
                <ambientLight intensity={0.8} color="blue" />
                <Teacher teacher={"Nanami"}
                    position={[0, -3.5, -3]}
                    scale={2}
                />
                {/* <Gltf src="/models/classroom_default.glb" position={[0.1, -1.7, -1]} /> */}

            </Canvas >

        </>
    )
}

const CameraManager = () => {
    return (
        <CameraControls
            minZoom={1}
            maxZoom={1}
            polarRotateSpeed={0}
            azimuthRotateSpeed={0}
            mouseButtons={{
                left: 0,
                wheel: 0,
                right: 0
            }}
            touches={{
                one: 0,
                two: 0,
            }}

        />
    )
}