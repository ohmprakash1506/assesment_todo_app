const taskModel = require("../model/task.model");

class taskController {
  createTask = async (req, res) => {
    try {
      const task = req.body.task;
      const description = req.body.description;

      const data = {
        task: task,
        description: description,
      };

      const taskData = await taskModel.create(data);
      if (!taskData)
        return res.status(403).send({ response: `Task creation error` });

      res.status(200).send({ response: `Task created successfully` });
    } catch (error) {
      return res.status(500).send({ response: error });
    }
  };

  updateTask = async (req, res) => {
    try {
      const taskId = req.query.taskId;
      const task = req.body.task;
      const description = req.body.description;
      const completed = req.body.completed;

      let data = {};
      if (task) data.task = task;
      if (description) data.description = description;
      if (completed) data.completed = completed

      const updatedTask = await taskModel.findByIdAndUpdate(taskId, data, {
        new: true,
      });

      if (!updatedTask)
        return res.status(404).send({ response: `Task not found` });

      res.status(200).send({ response: `Task updated successfully` });
    } catch (error) {
      return res.status(500).send({ response: error });
    }
  };

  deleteTask = async (req, res) => {
    try {
      const taskId = req.query.id;

      if (!taskId)
        return res.status(403).send({ response: `Task ID is required` });

      const updatedTask = await taskModel.findByIdAndUpdate(
        taskId,
        { status: false },
        { new: true }
      );

      if (!updatedTask)
        return res.status(404).send({ response: `Task details not deleted` });

      res.status(200).send({ response: `Task deleted successfully` });
    } catch (error) {
      console.log(`error:`, error);
      return res.status(500).send({ response: error });
    }
  };

  listTask = async (req, res) => {
    try {
      const page = parseInt(req.query.page? req.query.page : 0);
      const limit = parseInt(req.query.limit? req.query.limit : 10);
      const completed = req.query.completed;

      let pipeline = [{ $skip: page }, { $limit: limit }, {$match: {status: true}}];

      if (completed) {
        pipeline.push({ $match: { completed: completed } });
      }
      const totalTask = await taskModel.countDocuments(
        completed ? { completed: completed } : {}
      );
      const data = await taskModel.aggregate(pipeline);
      if (!data || !data.length > 0)
        return res
          .status(403)
          .send({ response: `Somthing went wrong fetching data` });
      let result = {
        currentPage: page,
        totalPages: Math.ceil(totalTask / limit),
        totalTask,
        data: data,
      };
      res.status(200).send({ response: result });
    } catch (error) {
      console.log(`Error:`, error);
      return res.status(500).send({ response: error });
    }
  };
}

module.exports = taskController