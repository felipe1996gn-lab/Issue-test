
'use strict';

const Issue = require('../models/Issue');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res) {
      const project = req.params.project;
      const query = { project };
      // Agrega filtros de query params
      for (let key in req.query) {
        if (req.query[key] !== undefined && req.query[key] !== '') {
          if (key === 'open') {
            query[key] = req.query[key] === 'true';
          } else {
            query[key] = req.query[key];
          }
        }
      }
      try {
        const issues = await Issue.find(query).exec();
        res.json(issues);
      } catch (err) {
        res.status(500).json({ error: 'database error' });
      }
    })
    
    .post(async function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      try {
        const issue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || '',
          status_text: status_text || '',
          open: true
        });
        await issue.save();
        res.json(issue);
      } catch (err) {
        res.status(500).json({ error: 'database error' });
      }
    })
    
    .put(async function (req, res) {
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      // Campos válidos para actualizar
      const validUpdateFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
      let updateFields = {};
      validUpdateFields.forEach(field => {
        if (req.body.hasOwnProperty(field)) {
          let value = req.body[field];
          if (field === 'open') {
            if (value === true || value === false || value === 'true' || value === 'false') {
              updateFields[field] = value === true || value === 'true';
            }
          } else {
            if (value !== undefined && value !== null) {
              let trimmedValue = typeof value === 'string' ? value.trim() : value;
              if (trimmedValue !== '') {
                updateFields[field] = trimmedValue;
              }
            }
          }
        }
      });
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }
      updateFields.updated_on = new Date();
      try {
        const updated = await Issue.findByIdAndUpdate(_id, updateFields, { new: true });
        if (!updated) {
          return res.json({ error: 'could not update', _id });
        }
        res.json({ result: 'successfully updated', _id });
      } catch (err) {
        res.json({ error: 'could not update', _id });
      }
    })
    
    .delete(async function (req, res) {
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      try {
        const deleted = await Issue.findByIdAndDelete(_id);
        if (!deleted) {
          return res.json({ error: 'could not delete', _id });
        }
        res.json({ result: 'successfully deleted', _id });
      } catch (err) {
        res.json({ error: 'could not delete', _id });
      }
    });
    
};
