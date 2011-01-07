/**
 * Copyright 2011 MountPosition Inc. All right reserved.
 */

var PhotoDB = {};

(function() {
  PhotoDB.DB_NAME = "wdbv61";
  
  PhotoDB.CREATE_TABLE_SQL = 'create table if not exists PHOTOS (ID integer, \
                                                                 FILE_NAME text, \
                                                                 TITLE text, \
                                                                 LNG real, \
                                                                 LAT real, \
                                                                 COMMENT text, \
                                                                 CREATED_AT timestamp, \
                                                                 PRIMARY KEY(ID))';
  
  PhotoDB.INSERT_SQL = 'insert into PHOTOS (FILE_NAME, TITLE, LNG, LAT, COMMENT, CREATED_AT) VALUES (?, ?, ?, ?, ?, datetime("now"))';
  PhotoDB.SELECT_ALL_SQL = 'select * from PHOTOS';
  
  PhotoDB.execute = function(callback) {
    var db = Titanium.Database.open(PhotoDB.DB_NAME);
    try {
      db.execute(PhotoDB.CREATE_TABLE_SQL);
      return callback(db);
    }
    finally {
      db.close();
    }
  };
  
  PhotoDB.select = function(callback) {
    return PhotoDB.execute(function(db) {
      var data = [];
      var rs = callback(db);
      while (rs.isValidRow()) {
        var rsRow = {};
        if (Titanium.Platform.name == "iPhone OS") {
          for (i = 0; i < rs.fieldCount(); i++) {
            rsRow[rs.fieldName(i).toLowerCase()] = rs.fieldByName(rs.fieldName(i));
          }
        } else {
          for (i = 0; i < rs.fieldCount; i++) {
            rsRow[rs.fieldName(i).toLowerCase()] = rs.fieldByName(rs.fieldName(i));
          }
        }
        
        data.push(rsRow);
        rs.next();
      }  
      rs.close();
      return data;
    });
  };
  
  PhotoDB.insert = function(args) {
    PhotoDB.execute(function(db) {
      db.execute(PhotoDB.INSERT_SQL, args.filename, args.title, args.lng, args.lat, args.comment);
    });
  };
})();
