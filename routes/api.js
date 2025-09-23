'use strict';

// In-memory storage for issues (organized by project)
let issues = {};
let idCounter = 1;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      // Initialize project issues if not exists
      if (!issues[project]) {
        issues[project] = [];
      }
      
      let projectIssues = issues[project];
      
      // Apply filters from query parameters
      let filteredIssues = projectIssues.filter(issue => {
        for (let key in req.query) {
          if (req.query[key] !== undefined && req.query[key] !== '') {
            // Convert boolean strings for 'open' field
            if (key === 'open') {
              let queryValue;
              if (req.query[key] === 'true') {
                queryValue = true;
              } else if (req.query[key] === 'false') {
                queryValue = false;
              } else {
                queryValue = req.query[key] === 'true'; // fallback behavior
              }
              if (issue[key] !== queryValue) {
                return false;
              }
            } else {
              // Handle string comparison for other fields
              if (String(issue[key]) !== String(req.query[key])) {
                return false;
              }
            }
          }
        }
        return true;
      });
      
      res.json(filteredIssues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
      // Check required fields
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      // Initialize project issues if not exists
      if (!issues[project]) {
        issues[project] = [];
      }
      
      // Create new issue
      let newIssue = {
        _id: (idCounter++).toString(),
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        open: true
      };
      
      // Add to project issues
      issues[project].push(newIssue);
      
      res.json(newIssue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
      try {
        // Check if _id is provided
        if (!req.body._id) {
          return res.json({ error: 'missing _id' });
        }
        
        // Check if there are fields to update FIRST (before checking if issue exists)
        // Define which fields are valid for updating
        const validUpdateFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
        
        // Only look at fields that are both present in request AND in valid fields list
        let updateFields = [];
        
        validUpdateFields.forEach(field => {
          if (req.body.hasOwnProperty(field)) {
            let value = req.body[field];
            
            // Special handling for 'open' field - only accept exact boolean values
            if (field === 'open') {
              if (value === true || value === false || value === 'true' || value === 'false') {
                updateFields.push(field);
              }
            } else {
              // For other string fields, trim whitespace and check if meaningful
              if (value !== undefined && value !== null) {
                let trimmedValue = typeof value === 'string' ? value.trim() : value;
                if (trimmedValue !== '') {
                  updateFields.push(field);
                }
              }
            }
          }
        });
        
        // If no valid update fields, return error regardless of whether _id exists
        if (updateFields.length === 0) {
          return res.json({ error: 'no update field(s) sent', '_id': String(req.body._id) });
        }
        
        // Now check if the issue exists (only after confirming there are fields to update)
        // Initialize project issues if not exists
        if (!issues[project]) {
          issues[project] = [];
        }
        
        let issueId = String(req.body._id);
        let issueIndex = issues[project].findIndex(issue => issue._id === issueId);
        
        if (issueIndex === -1) {
          return res.json({ error: 'could not update', '_id': String(req.body._id) });
        }
        
        // Update issue fields
        let issue = issues[project][issueIndex];
        
        // Update only the validated fields
        updateFields.forEach(field => {
          let value = req.body[field];
          if (field === 'open') {
            // Handle boolean conversion for open field - only exact matches allowed
            if (value === 'false' || value === false) {
              issue[field] = false;
            } else if (value === 'true' || value === true) {
              issue[field] = true;
            }
          } else {
            // Update field with the provided value (already validated as non-empty)
            issue[field] = typeof value === 'string' ? value.trim() : value;
          }
        });
        
        issue.updated_on = new Date().toISOString();
        res.json({ result: 'successfully updated', '_id': String(req.body._id) });
        
      } catch (error) {
        // Any other error should return 'could not update'
        return res.json({ error: 'could not update', '_id': String(req.body._id) });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
      // Check if _id is provided
      if (!req.body._id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Initialize project issues if not exists
      if (!issues[project]) {
        issues[project] = [];
      }
      
      let issueId = req.body._id.toString();
      let issueIndex = issues[project].findIndex(issue => issue._id === issueId);
      
      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', '_id': String(req.body._id) });
      }
      
      // Remove issue
      issues[project].splice(issueIndex, 1);
      res.json({ result: 'successfully deleted', '_id': String(req.body._id) });
    });
    
};
