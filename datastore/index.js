const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      return;
    } else {
      var path = `${exports.dataDir}/${id}.txt`;
      fs.writeFile(path, text, () => {
        callback(err, { id, text });
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var allTodos = [];
    if (err) {
      callback(null, allTodos);
    } else {
      var count = files.length;
      if (count > 0) {
        _.map(files, (file) => {
          var name = file.split('.')[0];
          exports.readOne(name, (err, todo) => {
            allTodos.push(todo);
            if (count === allTodos.length) {
              callback(null, allTodos);
            }
          });
        });
      } else {
        callback(null, allTodos);
      }
    }
  });
};

exports.readOne = (id, callback) => {
  var filePath = `${exports.dataDir}/${id}.txt`;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var todo = {id, text: data.toString()};
      callback(err, todo);
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  // have an id, grab file
  var filePath = `${exports.dataDir}/${id}.txt`;
  // write new text to the file of the FilePath
  fs.exists(filePath, (exists) => {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          return null;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var pathName = `${exports.dataDir}/${id}.txt`;
  fs.unlink(pathName, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
