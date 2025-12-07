import { Loader } from "@react-three/drei";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/MainLayout";
import { Button } from "../components/ui/button";
import Warehouse3D from "../components/Warehouse3D";
import type { RootState } from "../store";

interface BotPosition {
	id: number;
	x: number;
	y: number;
}

const MapPage: React.FC = () => {
	const bots = useSelector((state: RootState) => state.bots.bots);
	const [svgContent, setSvgContent] = useState<string | null>(null);
	const [botPositions, setBotPositions] = useState<BotPosition[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setBotPositions(
			bots.map((bot) => ({
				id: bot.id,
				x: Math.random() * 100,
				y: Math.random() * 100,
			})),
		);
	}, [bots.length]);

	useEffect(() => {
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

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type === "image/svg+xml") {
			const reader = new FileReader();
			reader.onload = (e) => {
				setSvgContent(e.target?.result as string);
			};
			reader.readAsText(file);
		} else {
			alert("Please upload a valid SVG file.");
		}
	};

	return (
		<MainLayout>
			<h1 className="text-2xl font-bold mb-4 text-center">Warehouse Map</h1>

			<div className="flex flex-col items-center gap-6">
				{!svgContent && (
					<div className="flex flex-col items-center gap-4 p-10 border-2 border-dashed rounded-xl bg-muted/20">
						<p className="text-muted-foreground">
							Upload your warehouse layout (SVG) or use a demo map
						</p>
						<div className="flex gap-4">
							<input
								type="file"
								accept=".svg"
								onChange={handleFileUpload}
								className="hidden"
								id="svg-upload"
							/>
							<Button asChild variant="outline">
								<label htmlFor="svg-upload" className="cursor-pointer">
									Upload SVG
								</label>
							</Button>
							<Button onClick={() => setSvgContent("DEMO_3D")}>
								Use Demo Map (3D)
							</Button>
						</div>
					</div>
				)}

				{svgContent && svgContent !== "DEMO_3D" && (
					<div
						className="relative w-full max-w-4xl aspect-video border rounded-xl overflow-hidden bg-white shadow-lg"
						ref={containerRef}
					>
						<div
							className="absolute inset-0 w-full h-full [&>svg]:w-full [&>svg]:h-full opacity-50"
							dangerouslySetInnerHTML={{ __html: svgContent }}
						/>

						{botPositions.map((pos) => {
							const bot = bots.find((b) => b.id === pos.id);
							const statusColor =
								bot?.status === "busy"
									? "bg-orange-500"
									: bot?.status === "error"
										? "bg-red-500"
										: bot?.status === "charging"
											? "bg-green-500"
											: "bg-blue-500";

							return (
								<div
									key={pos.id}
									className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white transition-all duration-1000 ease-in-out ${statusColor}`}
									style={{
										left: `${pos.x}%`,
										top: `${pos.y}%`,
										transform: "translate(-50%, -50%)",
									}}
									title={`Bot #${pos.id} - ${bot?.status}`}
								>
									{pos.id}
								</div>
							);
						})}

						<Button
							variant="outline"
							size="sm"
							className="absolute bottom-4 right-4 bg-background/80 backdrop-blur"
							onClick={() => setSvgContent(null)}
						>
							Change Map
						</Button>
					</div>
				)}

				{svgContent === "DEMO_3D" && (
					<div className="w-full max-w-5xl relative">
						<Warehouse3D />
						<Loader />
						<Button
							variant="outline"
							size="sm"
							className="absolute bottom-4 right-4 bg-white/80 backdrop-blur z-10"
							onClick={() => setSvgContent(null)}
						>
							Change Map
						</Button>
					</div>
				)}

				<div className="flex gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<span className="w-3 h-3 rounded-full bg-blue-500"></span> Idle
					</div>
					<div className="flex items-center gap-1">
						<span className="w-3 h-3 rounded-full bg-orange-500"></span> Busy
					</div>
					<div className="flex items-center gap-1">
						<span className="w-3 h-3 rounded-full bg-green-500"></span> Charging
					</div>
					<div className="flex items-center gap-1">
						<span className="w-3 h-3 rounded-full bg-red-500"></span> Error
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default MapPage;
