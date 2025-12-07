import {
	ContactShadows,
	Environment,
	OrbitControls,
	PerspectiveCamera,
	Text,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import type { RootState } from "../store";

const RACK_HEIGHT = 10;
const RACK_WIDTH = 5;
const RACK_DEPTH = 30;

const Floor = () => (
	<mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, -0.1, 50]} receiveShadow>
		<planeGeometry args={[120, 120]} />
		<meshStandardMaterial color="#f1f5f9" />
	</mesh>
);

const Grid = () => (
	<gridHelper
		args={[100, 20, "#cbd5e1", "#e2e8f0"]}
		position={[50, 0.01, 50]}
	/>
);

const Rack = ({
	position,
	label,
}: {
	position: [number, number, number];
	label: string;
}) => (
	<group position={position}>
		<mesh position={[0, RACK_HEIGHT / 2, 0]} castShadow receiveShadow>
			<boxGeometry args={[RACK_WIDTH, RACK_HEIGHT, RACK_DEPTH]} />
			<meshStandardMaterial color="#475569" />
		</mesh>

		<mesh position={[0, RACK_HEIGHT * 0.2, 0]}>
			<boxGeometry args={[RACK_WIDTH + 0.2, 0.5, RACK_DEPTH + 0.2]} />
			<meshStandardMaterial color="#94a3b8" />
		</mesh>
		<mesh position={[0, RACK_HEIGHT * 0.6, 0]}>
			<boxGeometry args={[RACK_WIDTH + 0.2, 0.5, RACK_DEPTH + 0.2]} />
			<meshStandardMaterial color="#94a3b8" />
		</mesh>

		<Text
			position={[0, RACK_HEIGHT + 2, 0]}
			fontSize={3}
			color="#1e293b"
			anchorX="center"
			anchorY="middle"
		>
			{label}
		</Text>
	</group>
);

const ZoneLabel = ({
	position,
	label,
	color,
}: {
	position: [number, number, number];
	label: string;
	color: string;
}) => (
	<group position={position}>
		<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
			<circleGeometry args={[8, 32]} />
			<meshStandardMaterial color={color} transparent opacity={0.3} />
		</mesh>
		<Text
			position={[0, 2, 0]}
			fontSize={3}
			color={color}
			anchorX="center"
			anchorY="middle"
		>
			{label}
		</Text>
	</group>
);

const Bot3D = ({
	id,
	status,
	x,
	y,
}: {
	id: number;
	status: string;
	x: number;
	y: number;
}) => {
	const meshRef = useRef<THREE.Group>(null);

	useFrame((_, delta) => {
		if (meshRef.current) {
			meshRef.current.position.x = THREE.MathUtils.lerp(
				meshRef.current.position.x,
				x,
				delta * 5,
			);
			meshRef.current.position.z = THREE.MathUtils.lerp(
				meshRef.current.position.z,
				y,
				delta * 5,
			);
		}
	});

	const color = useMemo(() => {
		switch (status) {
			case "busy":
				return "#f97316";
			case "charging":
				return "#22c55e";
			case "error":
				return "#ef4444";
			default:
				return "#3b82f6";
		}
	}, [status]);

	return (
		<group ref={meshRef} position={[x, 0, y]}>
			<mesh position={[0, 1.5, 0]} castShadow>
				<cylinderGeometry args={[1.5, 1.5, 1, 32]} />
				<meshStandardMaterial color="#334155" />
			</mesh>
			<mesh position={[0, 2.5, 0]} castShadow>
				<sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.5}
				/>
			</mesh>

			<mesh position={[1.2, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
				<cylinderGeometry args={[0.5, 0.5, 0.5, 16]} />
				<meshStandardMaterial color="#0f172a" />
			</mesh>
			<mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
				<cylinderGeometry args={[0.5, 0.5, 0.5, 16]} />
				<meshStandardMaterial color="#0f172a" />
			</mesh>

			<Text
				position={[0, 4.5, 0]}
				fontSize={2}
				color="black"
				anchorX="center"
				anchorY="middle"
				outlineWidth={0.1}
				outlineColor="white"
			>
				#{id}
			</Text>
		</group>
	);
};

const Warehouse3D: React.FC = () => {
	const bots = useSelector((state: RootState) => state.bots.bots);

	const [botPositions, setBotPositions] = React.useState<
		{ id: number; x: number; y: number }[]
	>([]);

	React.useEffect(() => {
		setBotPositions(
			bots.map((b) => ({
				id: b.id,
				x: Math.random() * 100,
				y: Math.random() * 100,
			})),
		);
	}, [bots.length]);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setBotPositions((prev) =>
				prev.map((pos) => ({
					id: pos.id,
					x: Math.min(100, Math.max(0, pos.x + (Math.random() - 0.5) * 5)),
					y: Math.min(100, Math.max(0, pos.y + (Math.random() - 0.5) * 5)),
				})),
			);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="w-full h-[500px] bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
			<Canvas shadows>
				<PerspectiveCamera makeDefault position={[50, 60, 120]} fov={50} />
				<OrbitControls target={[50, 0, 50]} maxPolarAngle={Math.PI / 2.1} />

				<ambientLight intensity={0.7} />
				<directionalLight
					position={[50, 100, 50]}
					intensity={1.5}
					castShadow
					shadow-mapSize={[2048, 2048]}
				/>
				<Environment preset="city" />

				<Floor />
				<Grid />

				<Rack position={[20, 0, 50]} label="Zone A" />
				<Rack position={[40, 0, 50]} label="Zone B" />

				<ZoneLabel position={[75, 0, 25]} label="Packing" color="#f97316" />
				<ZoneLabel position={[75, 0, 75]} label="Loading" color="#22c55e" />

				{botPositions.map((pos) => {
					const bot = bots.find((b) => b.id === pos.id);
					return (
						<Bot3D
							key={pos.id}
							id={pos.id}
							status={bot?.status || "idle"}
							x={pos.x}
							y={pos.y}
						/>
					);
				})}

				<ContactShadows
					resolution={1024}
					scale={150}
					blur={2}
					opacity={0.5}
					far={10}
					color="#000000"
				/>
			</Canvas>
		</div>
	);
};

export default Warehouse3D;
