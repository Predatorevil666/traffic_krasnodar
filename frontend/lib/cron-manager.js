const cron = require('node-cron');

class CronManager {
	constructor() {
		this.tasks = new Map();
	}

	// Остановить все задачи
	stopAll() {
		console.log(`Stopping ${this.tasks.size} cron tasks`);
		for (const [name, task] of this.tasks) {
			try {
				if (typeof task.stop === 'function') {
					task.stop();
				}
				if (typeof task.destroy === 'function') {
					task.destroy();
				}
				console.log(`Stopped task: ${name}`);
			} catch (error) {
				console.log(`Error stopping task ${name}:`, error.message);
			}
		}
		this.tasks.clear();

		// Дополнительно пытаемся получить все задачи из node-cron и остановить их
		try {
			const cron = require('node-cron');
			const allTasks = cron.getTasks();
			console.log(`Found ${allTasks.size} total node-cron tasks`);
			allTasks.forEach((task, key) => {
				try {
					task.stop();
					console.log(`Force stopped node-cron task: ${key}`);
				} catch (e) {
					console.log(`Error force stopping task ${key}:`, e.message);
				}
			});
		} catch (error) {
			console.log('Could not access node-cron tasks directly');
		}
	}

	// Создать новую задачу
	schedule(name, cronExpression, callback, options = {}) {
		// Сначала останавливаем существующую задачу с таким именем
		if (this.tasks.has(name)) {
			const oldTask = this.tasks.get(name);
			try {
				if (typeof oldTask.stop === 'function') {
					oldTask.stop();
				}
				if (typeof oldTask.destroy === 'function') {
					oldTask.destroy();
				}
			} catch (error) {
				console.log(`Error stopping old task ${name}:`, error.message);
			}
		}

		// Создаем новую задачу
		const task = cron.schedule(cronExpression, callback, {
			scheduled: true,
			timezone: "Europe/Moscow",
			...options
		});

		this.tasks.set(name, task);
		console.log(`Scheduled task "${name}" with cron: ${cronExpression}`);
		return task;
	}

	// Остановить конкретную задачу
	stop(name) {
		if (this.tasks.has(name)) {
			const task = this.tasks.get(name);
			try {
				if (typeof task.stop === 'function') {
					task.stop();
				}
				if (typeof task.destroy === 'function') {
					task.destroy();
				}
				this.tasks.delete(name);
				console.log(`Stopped and removed task: ${name}`);
			} catch (error) {
				console.log(`Error stopping task ${name}:`, error.message);
			}
		}
	}

	// Получить статус всех задач
	getStatus() {
		const status = [];
		for (const [name, task] of this.tasks) {
			status.push({
				name,
				running: task.getStatus() === 'scheduled'
			});
		}
		return status;
	}
}

// Единственный экземпляр менеджера
const cronManager = new CronManager();

export { cronManager };
