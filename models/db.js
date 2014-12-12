var mysql   = require('mysql');


/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
    host: 'cwolf.cs.sonoma.edu',
    user: 'mdavis',
    password: '003609546'
    //user: 'your_username',
    //password: 'your_password'
});

var dbToUse = 'mdavis';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;

//create the Account table if it does not exist
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS SigPeople('
        + 'PersonID INT AUTO_INCREMENT Primary Key '
		+ ',Money INT '
        + ',FirstName VARCHAR(50) NOT NULL'
        + ',LastName VARCHAR(50) NOT NULL'
        + ',StateOfResidence VARCHAR(50) NOT NULL'
        + ')';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS Spouse('
        + 'SpouseName VARCHAR(100)'
		+ ',PersonID INT PRIMARY KEY AUTO_INCREMENT'
        + ',SpouseID INT REFERENCES SigPeople(PersonID)'
        + ')';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS Heir('
        + 'Age INT'
		+ ',LastName VARCHAR(50)'
		+ ',FirstName VARCHAR(50)'
		+ ',HeirID INT PRIMARY KEY AUTO_INCREMENT'
        + ',PersonID INT REFERENCES SigPeople(PersonID)'
        + ')';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS TFollowers('
        + 'AccountID INT REFERENCES TAccount(AccountID)'
		+ ',FollowerID INT REFERENCES TAccount(AccountID)'
		+ ',PRIMARY KEY(AccountID, FollowerID));'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createViewQry = 'CREATE or REPLACE View GetAllView as '
        + 'Select a.PersonID, a.FirstName, a.LastName From SigPeople a;';
    connection.query(createViewQry, function (err) {
        if (err) throw err;
    });
});






exports.GetEmail = function(callback) {
	connection.query('select * from TAccount;',
	
	 function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
exports.ShowAllData = function(AccountID, callback) {
    console.log(AccountID);
    var query = 'select Username, FirstName, LastName, Bio, TotalRetweets, AverageRetweets, NumPostsMade, NumFollowers '
			+ ' from (select AccountID, Username, FirstName, LastName, Bio From TAccount where AccountID = '+AccountID+')as a'
			+ ' join (SELECT AccountID, SUM(ReTweet) AS TotalRetweets FROM TPost WHERE AccountID = '+AccountID+')as b'
			+ ' join (SELECT AccountID, AVG(ReTweet) AS AverageRetweets FROM TPost WHERE AccountID = '+AccountID+')as c'
			+ ' join (SELECT AccountID, COUNT(*) AS NumPostsMade FROM TPost WHERE AccountID = '+AccountID+' GROUP BY AccountID)as d'
			+ ' join (SELECT AccountID, COUNT(*) AS NumFollowers FROM TFollowers WHERE AccountID = '+AccountID+' GROUP BY AccountID)as e'
			+ ' ON a.AccountID=b.AccountID=c.AccountID=d.AccountID=e.AccountID;';
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
exports.GetAll = function(AccountID, callback) {
    console.log(AccountID);
    connection.query('select * from TAccount a where AccountID = ' + AccountID + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
exports.GetAllView = function(callback) {
	connection.query('select * from GetAllView;',
		function (err, result) {
			if(err){
				console.log(err);
				callback(true);
				return;
			}
			callback(false, result);
		}
	);
}

exports.GetByID = function(userInfo, callback) {
	var query = 'select * from TAccount where AccountID = ' + userInfo.AccountID + ';';
	
	connection.query(query, 
		function (err, result) {
		console.log(query);
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			console.log(query);
			callback(false, result);
		}
	);
} 

exports.GetPostByID = function(PersonID, callback) {
	//var query = 'select a.AccountID, a.Username, p.Post, p.ReTweet from TAccount a left join TPost p on a.AccountID = p.AccountID where a.AccountID = ' + AccountID + ';';
	var query = 'select a.PersonID, a.Money, a.FirstName, a.LastName, a.StateofResidence, s.SpouseName from SigPeople a left join Spouse s on a.PersonID = s.PersonID where a.PersonID = ' + PersonID + ';';
	connection.query(query, 
		function (err, result) {
		console.log(query);
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			console.log(query);
			callback(false, result);
		}
	);
} 

exports.Insert = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO SigPeople (Money, FirstName, LastName, StateofResidence) '
    			+ 'VALUES (\'' 
    			+ userInfo.money + '\', \'' 
    			+ userInfo.firstname + '\', \'' 
    			+ userInfo.lastname + '\', \'' 
    			+ userInfo.stateofresidence  
    			+ '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}
exports.InsertPost = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO TPost (AccountID, Post, ReTweet) VALUES (\'' 
    		+ userInfo.accountID + '\', \'' 
    		+ userInfo.post + '\', \'' 
    		+ userInfo.retweet + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.EditUser = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'UPDATE TAccount Set'
    			+ ' Username = \'' + userInfo.username 
    			+ '\', Email = \'' + userInfo.email 
    			+ '\', Password = \'' + userInfo.password 
    			+ '\', FirstName = \'' + userInfo.firstname 
    			+ '\', LastName = \'' + userInfo.lastname 
    			+ '\', Bio = \'' + userInfo.bio 
    			+ '\' WHERE AccountID = ' + userInfo.accountID + ';';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.AddFollowers = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Spouse (PersonID, SpouseID, SpouseName) VALUES (\'' 
    		+ userInfo.PersonID + '\', \''
            + userInfo.SpouseID + '\', \''
    		+ userInfo.SpouseName + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.GetByUsername = function(Username, callback) {
	var query = 'select * from TAccount a left join TFollowers f on a.AccountID = f.AccountID   where Username = '+ Username +';';
	
	connection.query(query, 
		function (err, result) {
		console.log(query);
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			console.log(query);
			callback(false, result);
		}
	);
} 
exports.GetFriends = function(callback) {
	var query = 'select * from TAccount a left join TFollowers f on a.AccountID = f.AccountID   where Username = '+ Username +';';
	
	connection.query(query, 
		function (err, result) {
		console.log(query);
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			console.log(query);
			callback(false, result);
		}
	);
} 

