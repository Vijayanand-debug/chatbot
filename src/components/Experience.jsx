
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
import { degToRad } from "three/src/math/MathUtils.js"
import { useAITeacher } from "@/hooks/useAITeacher";
import { TypingBox } from "./TypingBox";
import { BoardSettings } from "./BoardSettings";
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
            position: [0.45, 0.382, -6],
        },
    },
    alternative: {
        classroom: {
            position: [0.3, -1.7, -1.5],
            rotation: [0, degToRad(-90), 0],
            scale: 0.4,
        },
        teacher: { position: [-1, -1.7, -3] },
        board: { position: [1.4, 0.84, -8] },
    },
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
            <div className="z-10 md:justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
                <TypingBox />
            </div>
            <Canvas camera={{
                position: [0, 0, 0.0001],
            }}>
                <CameraManager />
                <Html
                    transform
                    {...itemPlacement[classroom].board}
                    distanceFactor={1}
                >
                    <MessagesList />
                    {/* <BoardSettings /> */}
                </Html>
                <Environment preset="sunset" />
                <ambientLight intensity={0.8} color="blue" />
                <Teacher teacher={"Nanami"}
                    position={[-0.8, -1.7, -3]}
                    scale={1.5}
                    rotation-y={degToRad(20)}
                />
                <Gltf src="/models/classroom_default.glb" position={[0.2, -1.7, -2]} />

            </Canvas>

        </>
    )
}

const CameraManager = () => {
    return (
        <CameraControls
            minZoom={1}
            maxZoom={3}
            polarRotateSpeed={-0.3}
            azimuthRotateSpeed={-0.3}
            mouseButtons={{
                left: 1,
                wheel: 16,
            }}
            touches={{
                one: 32,
                two: 512,
            }}

        />
    )
}