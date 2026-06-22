import {
	Check,
	Circle,
	Database,
	Layers,
	Palette,
	Plus,
	Trash2,
	Zap,
} from "lucide-react";
import React, { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskStore } from "@/stores/taskStore";

const priorityColors: Record<string, string> = {
	high: "bg-red-500/10 text-red-500 border-red-500/20",
	medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	low: "bg-green-500/10 text-green-500 border-green-500/20",
};

const priorityLabels: Record<string, string> = {
	high: "高",
	medium: "中",
	low: "低",
};

function TaskManager() {
	const {
		tasks,
		filter,
		addTask,
		toggleTask,
		removeTask,
		setFilter,
		getFilteredTasks,
		getStats,
	} = useTaskStore();
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskPriority, setNewTaskPriority] = useState<
		"low" | "medium" | "high"
	>("medium");
	const stats = getStats();
	const filteredTasks = getFilteredTasks();

	const handleAddTask = () => {
		if (newTaskTitle.trim()) {
			addTask(newTaskTitle.trim(), newTaskPriority);
			setNewTaskTitle("");
		}
	};

	return (
		<Card className="border-border/50 shadow-lg">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-lg flex items-center gap-2">
							<Database className="h-5 w-5 text-primary" />
							Zustand 任务管理器
						</CardTitle>
						<CardDescription className="mt-1">
							使用 Zustand 进行全局状态管理的交互式演示
						</CardDescription>
					</div>
					<Badge variant="outline" className="text-xs">
						Zustand v5
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Progress */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">完成进度</span>
						<span className="font-medium">{stats.progress}%</span>
					</div>
					<Progress value={stats.progress} className="h-2" />
					<div className="flex gap-4 text-xs text-muted-foreground">
						<span>总计: {stats.total}</span>
						<span>已完成: {stats.completed}</span>
						<span>进行中: {stats.active}</span>
					</div>
				</div>

				<Separator />

				{/* Add task */}
				<div className="flex gap-2">
					<input
						type="text"
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
						placeholder="添加新任务..."
						className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
					/>
					<select
						value={newTaskPriority}
						onChange={(e) =>
							setNewTaskPriority(e.target.value as "low" | "medium" | "high")
						}
						className="px-2 py-2 text-sm rounded-md border border-input bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
					>
						<option value="high">高优先级</option>
						<option value="medium">中优先级</option>
						<option value="low">低优先级</option>
					</select>
					<Button
						size="sm"
						onClick={handleAddTask}
						disabled={!newTaskTitle.trim()}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>

				{/* Filter */}
				<Tabs
					value={filter}
					onValueChange={(v) => setFilter(v as typeof filter)}
				>
					<TabsList className="w-full">
						<TabsTrigger value="all" className="flex-1">
							全部
						</TabsTrigger>
						<TabsTrigger value="active" className="flex-1">
							进行中
						</TabsTrigger>
						<TabsTrigger value="completed" className="flex-1">
							已完成
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Task list */}
				<div className="space-y-2">
					{filteredTasks.map((task) => (
						<div
							key={task.id}
							className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors group"
						>
							<button
								onClick={() => toggleTask(task.id)}
								className="shrink-0 transition-colors"
							>
								{task.completed ? (
									<Check className="h-5 w-5 text-primary" />
								) : (
									<Circle className="h-5 w-5 text-muted-foreground" />
								)}
							</button>
							<span
								className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
							>
								{task.title}
							</span>
							<Badge
								variant="outline"
								className={`text-xs ${priorityColors[task.priority]}`}
							>
								{priorityLabels[task.priority]}
							</Badge>
							<button
								onClick={() => removeTask(task.id)}
								className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					))}
					{filteredTasks.length === 0 && (
						<p className="text-center text-sm text-muted-foreground py-4">
							暂无任务
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function ButtonShowcase() {
	return (
		<Card className="border-border/50 shadow-lg">
			<CardHeader>
				<CardTitle className="text-lg flex items-center gap-2">
					<Zap className="h-5 w-5 text-primary" />
					Button 按钮组件
				</CardTitle>
				<CardDescription>shadcn/ui 提供的多种按钮变体</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-wrap gap-3">
					<Button variant="default">Default</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
				</div>
				<Separator />
				<div className="flex flex-wrap gap-3 items-center">
					<Button size="sm">小按钮</Button>
					<Button size="default">默认按钮</Button>
					<Button size="lg">大按钮</Button>
					<Button size="icon">
						<Zap className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function BadgeShowcase() {
	return (
		<Card className="border-border/50 shadow-lg">
			<CardHeader>
				<CardTitle className="text-lg flex items-center gap-2">
					<Palette className="h-5 w-5 text-primary" />
					Badge 徽章组件
				</CardTitle>
				<CardDescription>用于状态指示和标签展示</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-3">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
						自定义
					</Badge>
					<Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
						主题
					</Badge>
					<Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
						颜色
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}

function SwitchShowcase() {
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [autoSave, setAutoSave] = useState(true);

	return (
		<Card className="border-border/50 shadow-lg">
			<CardHeader>
				<CardTitle className="text-lg flex items-center gap-2">
					<Layers className="h-5 w-5 text-primary" />
					Switch 开关组件
				</CardTitle>
				<CardDescription>Radix UI 构建的无障碍开关</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium">推送通知</p>
						<p className="text-xs text-muted-foreground">接收来自应用的推送</p>
					</div>
					<Switch checked={notifications} onCheckedChange={setNotifications} />
				</div>
				<Separator />
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium">深色模式</p>
						<p className="text-xs text-muted-foreground">切换深色主题</p>
					</div>
					<Switch checked={darkMode} onCheckedChange={setDarkMode} />
				</div>
				<Separator />
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium">自动保存</p>
						<p className="text-xs text-muted-foreground">自动保存更改</p>
					</div>
					<Switch checked={autoSave} onCheckedChange={setAutoSave} />
				</div>
			</CardContent>
		</Card>
	);
}

function AccordionShowcase() {
	return (
		<Card className="border-border/50 shadow-lg">
			<CardHeader>
				<CardTitle className="text-lg">常见问题 (Accordion)</CardTitle>
				<CardDescription>使用 Radix Accordion 构建的可折叠面板</CardDescription>
			</CardHeader>
			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger>什么是 shadcn/ui？</AccordionTrigger>
						<AccordionContent>
							shadcn/ui 是一个基于 Radix UI 和 Tailwind CSS
							构建的可复用组件集合。 它不是一个传统的组件库——你不需要通过 npm
							安装它。
							相反，你可以直接将组件的源代码复制到你的项目中，然后自由定制。
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>什么是 Zustand？</AccordionTrigger>
						<AccordionContent>
							Zustand 是一个小巧、快速、可扩展的 React 状态管理库。 它使用简洁的
							API 来创建全局状态存储（Store）， 没有样板代码，不需要 Provider
							包裹组件树， 并且支持 TypeScript、中间件和 devtools。
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger>为什么选择这个技术栈？</AccordionTrigger>
						<AccordionContent>
							<strong>React</strong> 提供了强大的组件化开发能力；
							<strong>Tailwind CSS</strong> 提供了实用优先的样式方案；
							<strong>shadcn/ui</strong> 提供了精美的预构建组件；
							<strong>Zustand</strong> 提供了轻量级的状态管理。
							这四者组合可以极大地提高开发效率和用户体验。
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
}

export default function TechShowcase() {
	const [mounted, setMounted] = useState(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="space-y-8 not-prose min-h-[500px] flex items-center justify-center text-muted-foreground">
				Loading components...
			</div>
		);
	}

	return (
		<div className="space-y-8 not-prose">
			{/* Tech stack badges header */}
			<div className="flex flex-wrap gap-2 justify-center p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
				<Badge className="bg-blue-500 text-white border-none hover:bg-blue-600">
					React 19
				</Badge>
				<Badge className="bg-cyan-500 text-white border-none hover:bg-cyan-600">
					Tailwind CSS 3
				</Badge>
				<Badge className="bg-zinc-800 text-white border-none hover:bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-800">
					shadcn/ui
				</Badge>
				<Badge className="bg-amber-500 text-white border-none hover:bg-amber-600">
					Zustand 5
				</Badge>
				<Badge className="bg-purple-500 text-white border-none hover:bg-purple-600">
					Astro MDX
				</Badge>
			</div>

			{/* Components grid */}
			<div className="grid gap-6 md:grid-cols-2">
				<ButtonShowcase />
				<BadgeShowcase />
				<SwitchShowcase />
				<AccordionShowcase />
			</div>

			{/* Full width Zustand demo */}
			<TaskManager />
		</div>
	);
}
