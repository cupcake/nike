(function () {

"use strict";

var nTasks = 0;
Nike.Stores.Tasks = Marbles.Store.createClass({
	displayName: "Nike.Stores.Tasks",

	getTasks: function (taskId) {
		if (taskId) {
			var task = this.__findTask(taskId, this.state.tasks);
			return task ? task.tasks : [];
		} else {
			return this.state.tasks;
		}
	},

	getInitialState: function () {
		function genTasks(level, maxLevel) {
			var tasks = [];
			for (var i = 0, n; i <= 10; i++) {
				n = nTasks++;
				tasks.push({
					id: "task-"+ n,
					name: "task "+ n,
					complete: false,
					tasks: []
				});

				if (level < maxLevel) {
					tasks[i].tasks = genTasks(level + 1, maxLevel);
				}
			}
			return tasks;
		}

		return {
			tasks: genTasks(0, 3)
		};
	},

	handleEvent: function (event) {
		switch (event.name) {
			case "CREATE_TASK":
				this.__createTask(event.data);
			break;

			case "SET_TASK_COMPLETION":
				this.__setTaskCompletion(event.taskId, event.taskComplete);
			break;

			case "DELETE_TASK":
				this.__deleteTask(event.taskId);
			break;
		}
	},

	__findTask: function (taskId, tasks) {
		var task = null;
		for (var i = 0, ref, len = tasks.length; i < len; i++) {
			if (tasks[i].id === taskId) {
				task = tasks[i];
				break;
			}
			ref = this.__findTask(taskId, tasks[i].tasks);
			if (ref) {
				return ref;
			}
		}
		return task;
	},

	__createTask: function (data) {
		data.id = "task-"+ (nTasks++);
		data.complete = false;
		data.tasks = [];
		var tasks = this.state.tasks;
		var parentId;
		if (data.parentId) {
			parentId = data.parentId;
			delete data.parentId;
		}
		if (parentId) {
			var parentTask = this.__findTask(parentId, tasks);
			parentTask.tasks.push(data);
		} else {
			tasks.push(data);
		}
		this.setState({
			tasks: tasks
		});
	},

	__setTaskCompletion: function (taskId, taskComplete) {
		var tasks = this.state.tasks;
		var task = this.__findTask(taskId, tasks);
		task.complete = taskComplete;
		this.setState({
			tasks: tasks
		});
	},

	__deleteTask: function (taskId) {
		function deleteTask(tasks) {
			for (var i = 0, len; i < tasks.length; i++) {
				if (tasks[i].id === taskId) {
					tasks = tasks.slice(0, i).concat(tasks.slice(i+1, tasks.length));
					return tasks;
				}
				len = tasks[i].tasks.length;
				tasks[i].tasks = deleteTask(tasks[i].tasks);
				if (len !== tasks[i].tasks.length) {
					return tasks;
				}
			}
			return tasks;
		}
		var tasks = this.state.tasks;
		tasks = deleteTask(tasks);
		this.setState({
			tasks: tasks
		});
	}
});

Nike.Stores.Tasks.registerWithDispatcher(Nike.Dispatcher);

})();
