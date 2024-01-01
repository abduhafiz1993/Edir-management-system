<?php
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Access-Control-Allow-Headers: Content-Type');
header("Access-Control-Allow-Credentials: true");

include "Method.php";

$mothed = $_SERVER['REQUEST_METHOD'];
switch ($mothed) {
    case "GET":
        if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/numberOfuser') {
            $date = date('Y') - 1;
            $sql = "SELECT 
                    COUNT(CASE WHEN sex = 'male'  THEN 1 END) AS Male,
                    COUNT(CASE WHEN sex = 'female' THEN 1 END) AS Female,
                    (SELECT COUNT(*) FROM taskTab) AS task,
                    (SELECT COUNT(*) FROM eventtab) AS events,
                    user.*,
                    COUNT(CASE WHEN joinedDate > '$date' THEN 1 END) as newUser,
                    COUNT(*) AS Member
                    FROM user";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Event') {
            //MESSAGE RESPONSING 
            $sql1 = "SELECT * FROM `eventtab`";
            // $username=$_SESSION['username'];
            $stmt = $conn->prepare($sql1);
            $stmt->execute();
            $msg = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($msg);
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/voting') {
            $sql = "SELECT * FROM `election` WHERE `done` <> 1 ORDER BY `round` DESC";
            $stmt = $conn->prepare($sql);
            try {
                $stmt->execute();
            } catch (PDOException $e) {
                echo $e;
            }
            $electionInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($electionInfo) {
                $currentDate = date('Y-m-d');
                $firstrow = $electionInfo[0];
                $round = $firstrow['round'];
                $electionId = $firstrow['id'];
                $currentDate = date('Y-m-d');
                if ($firstrow['endDate'] > $currentDate) {
                    $sql = "SELECT `candidate`.*, `user`.`fname`, `user`.`lname`, `user`.`joinedDate`, `user`.`fname` 
                    FROM `candidate` JOIN  `user` ON `user`.`username`=`candidate`.`username` 
                    where election_id='$electionId'  ORDER BY `candidate`.`accepted` ASC";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute();
                    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    echo json_encode($users);
                } else {
                    $response = ['status' => 1, 'isElectionTime' => false, 'candidationTime' => false];
                    echo json_encode($response);
                }
            } else {
                $response = ['status' => 1, 'isElectionTime' => false, 'candidationTime' => false];
                echo json_encode($response);
            }
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/voting/votable') {
            $sql = "SELECT * FROM `election` WHERE `done` <> 1 ORDER BY `round` DESC";
            $stmt = $conn->prepare($sql);
            try {
                $stmt->execute();
            } catch (PDOException $e) {
                echo $e;
            }
            $electionInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($electionInfo) {
                $currentDate = date('Y-m-d');
                $firstrow = $electionInfo[0];
                $round = $firstrow['round'];
                $electionId = $firstrow['id'];
                $currentDate = date('Y-m-d');
                if ($firstrow['endDate'] > $currentDate) {
                    $sql = "SELECT `candidate`.*, `user`.`fname`, `user`.`lname`, `user`.`joinedDate`, `user`.`fname` 
                    FROM `candidate` JOIN  `user` ON `user`.`username`=`candidate`.`username` 
                    where election_id='$electionId' and `candidate`.`accepted`=1  ORDER BY `candidate`.`accepted` ASC";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute();
                    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    echo json_encode($users);
                } else {
                    $response = ['status' => 1, 'isElectionTime' => false, 'candidationTime' => false];
                    echo json_encode($response);
                }
            } else {
                $response = ['status' => 1, 'isElectionTime' => false, 'candidationTime' => false];
                echo json_encode($response);
            }
        } elseif ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Election') {
            $sql = "SELECT * FROM `election` WHERE `done` <> 1 ORDER BY `round` DESC";
            $stmt = $conn->prepare($sql);
            try {
                $stmt->execute();
            } catch (PDOException $e) {
                echo $e;
            }
            $electionInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($electionInfo) {
                $isElectionTime = false;
                $currentDate = date('Y-m-d');
                $firstrow = $electionInfo[0];
                $round = $firstrow['round'];
                if ($firstrow['endDate'] > $currentDate) {
                    $isElectionTime = true;
                    $candEndDate = date('Y-m-d', strtotime('+1 days'));
                    if ($candEndDate == $firstrow['endDate'] or ($candEndDate >= $firstrow['endDate'])) {
                        $candidationTime = false;
                    } else {
                        $candidationTime = true;
                    }
                } else if ($firstrow['endDate'] <= $currentDate) {
                    $isElectionTime = false;
                    EndElection($round);
                }
                $response = ['status' => 1, 'isElectionTime' => $isElectionTime, 'candidationTime' => $candidationTime];
                echo json_encode($response);
            } else {
                $response = ['status' => 1, 'isElectionTime' => false, 'candidationTime' => false];
                echo json_encode($response);
            }
        } elseif ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/property') {
            $sql = "SELECT * from property";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($users);
        } else {
            $sql = "SELECT * FROM user";
            $path = explode('/', $_SERVER['REQUEST_URI']);
            //select specific user
            if (isset($path[3]) && is_numeric($path[3])) {
                $sql .= " WHERE username = :username";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':username', $path[3]);
                $stmt->execute();
                $users = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode($users);
        }
        break;

    case "POST":
        /**
         * LOGIN CODE DONE BELOW;
         *  
         */

        // Check if it's a POST request to the login endpoint
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/Edir/Edir_api/user/login') {
            // Retrieve the login credentials from the request body
            $user = json_decode(file_get_contents('php://input'));
            $username = testInput($user->username);
            $password = testInput($user->password);

            if (!empty($username) && !empty($password)) {
                // Validate the username and password
                // Perform your database query here
                $validUser = false;
                if (!empty($username) && !empty($password)) {
                    $sql = "SELECT * FROM `user` WHERE `username` = :username LIMIT 1";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
                    $stmt->execute();

                    if ($stmt->rowCount() > 0) {
                        $data = $stmt->fetch(PDO::FETCH_ASSOC);
                        if ($data['username'] === $username && $data['password'] === $password) {
                            $validUser = true;
                        }
                    }
                }

                if ($validUser) {

                    exit;
                } else {
                    $response = array('login' => false);
                    echo json_encode($response);
                    exit;
                }
            } else {
                // Missing username or password
                http_response_code(400);
                $response = array('error' => 'Missing credentials');
                echo json_encode($response);
                exit;
            }
        }
        /***
         *  
         * TRINGN TO DO THE JWT 
         * 
         */
        else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/login') {
            $user = json_decode(file_get_contents('php://input'));
            $username = testInput($user->username);
            $password = testInput($user->password);
            logIn($username, $password);
        }

        /**
         * CHECK IF LOGIN
         */

        else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/login/check') {
            $user = json_decode(file_get_contents('php://input'));
            $username = $user->username;
            $sql = "SELECT * FROM `user` WHERE username=:username";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();
            $userInfo = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($userInfo['role'] === $user->role) {
                $resp = ['islogin' => true, 'role' => true];
                echo json_encode($resp);
            } else {
                $resp = ['islogin' => false, 'role' => false];
                echo json_encode($resp);
            }
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/property') {

            $boughtDate = $_POST["boughtDate"];
            $name = $_POST["name"];
            $quantity = $_POST["quantity"];

            // Handle the file upload
            $file = $_FILES["file"];
            $fileName = $file["name"];
            $fileTmpName = $file["tmp_name"];
            $fileSize = $file["size"];
            $fileError = $file["error"];

            // Check if file was uploaded successfully
            if ($fileError === 0) {
                // Specify the directory to save the uploaded file
                $uploadDir = "uploads/";

                $targetFolder = __DIR__ . '/pic/';
                // $target = $targetFolder . basename($image);

                $destination = $targetFolder . basename($fileName);

                // Move the uploaded file to the destination directory
                if (move_uploaded_file($fileTmpName, $destination)) {
                    $sql = "INSERT INTO `property`(`propertName`, `quantity`, `boughtDate`, `picName`)
                    VALUES ('$name','$quantity','$boughtDate','$fileName')";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute();
                    exit();
                } else {
                    // File upload failed
                    echo "Error uploading file.";
                }
            } else {
                // File upload error
                echo "Error: " . $fileError;
            }
        }
        /**
         * 
         * EVENTS
         * 
         */
        else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Event') {
            $Event = json_decode(file_get_contents('php://input'));

            $sql = "INSERT INTO `eventtab` (`message`, `sender`, `sent_date`) VALUES (:message, :sender, :sent_date)";
            $stmt = $conn->prepare($sql);

            // Sanitize and bind the values
            $message = testInput($Event->message);
            $sender = 'after'; // Assuming 'after' is the desired sender value
            $sent_date = date('Y-m-d H:i:s');

            $stmt->bindParam(':message', $message, PDO::PARAM_STR);
            $stmt->bindParam(':sender', $sender, PDO::PARAM_STR);
            $stmt->bindParam(':sent_date', $sent_date, PDO::PARAM_STR);

            $okay = false;
            try {
                $stmt->execute();
                $okay = true;
            } catch (PDOException $e) {
                echo $e;
            }
            if ($okay) {
                $response = ['status' => 1, 'message' => 'Record created successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
            }
            echo json_encode($response);
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Event/new') {
            $msg = json_decode(file_get_contents('php://input'));
            $username = $msg->username;
            $sql = "SELECT eventtab.*
            FROM eventtab
            LEFT JOIN readnotification ON eventtab.id = readnotification.eventId 
            AND readnotification.username = :username
            WHERE readnotification.eventId IS NULL";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();


            $newMessages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($newMessages);
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Event/seen') {
            echo "seen";
            $msg = json_decode(file_get_contents('php://input'));
            $username = $msg->username;
            $msg_id = $msg->msg_id;
            $sql = "INSERT INTO readnotification (username, eventId) VALUES (:username, :msg_id)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':msg_id', $msg_id);
            $stmt->execute();
        }
        /**
         * 
         * 
         * USER INSERTING CODE DONE BELOW;
         * 
         * 
         */
        else if ($_SERVER['REQUEST_URI'] === '/Edir/Edir_api/user/save') {
            $user = json_decode(file_get_contents('php://input'));
            if (isset($_FILES['image']) && isset($_POST['username'])) {
                $username = $_POST['username'];
                $image = $_FILES['image']['name'];
                $size = $_FILES['image']['size'];
                $targetFolder = __DIR__ . '/pic/';
                $target = $targetFolder . basename($image);
                $imageFileType = strtolower(pathinfo($target, PATHINFO_EXTENSION));
                $uploadOk = 1;

                // Check if image file is a valid image
                $check = getimagesize($_FILES["image"]["tmp_name"]);
                if ($check === false) {
                    echo "File is not an image.";
                    $uploadOk = 0;
                }

                // Check file size (optional)
                if ($size > 1000000) {
                    echo "File is too large.";
                    $uploadOk = 0;
                }

                // Allow only certain file formats (optional)
                if ($imageFileType != "jpg" && $imageFileType != "jpeg" && $imageFileType != "png" && $imageFileType != "gif") {
                    echo "Only JPG, JPEG, PNG, and GIF files are allowed.";
                    $uploadOk = 0;
                }

                // Check if $uploadOk is set to 0 by an error
                if ($uploadOk == 0) {
                    echo "File was not uploaded.";
                } else {
                    // If everything is ok, move the uploaded file to a directory

                    // Insert the file path into the database

                    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target)) {
                        $sql = "UPDATE `user` SET profilePic = :image WHERE username = :username";

                        // Prepare the PDO statement
                        $stmt = $conn->prepare($sql);

                        // Bind the parameters
                        $stmt->bindParam(':image', $image);
                        $stmt->bindParam(':username', $username);

                        // Execute the query
                        if ($stmt->execute()) {
                            echo "Profile picture updated successfully.";
                        } else {
                            echo "Error updating profile picture: " . $stmt->errorInfo()[2];
                        }
                    }
                }
            } else {
                $sex = testInput($user->sex);
                $fname = testInput($user->fname);
                $lname = testInput($user->lname);
                $phoneNumber = testInput($user->phoneNumber);
                $email = testInput($user->email);
                $password = testInput($user->password);

                //    $password = password_hash($password, PASSWORD_ARGON2I);

                $birthdate = testInput($user->birthdate);
                $address = testInput($user->address);
                $role = testInput($user->role);
                $username =  CreateUserName($fname, $lname);
                if (!empty($user->username)) {
                    $ssql = "SELECT id from user WHERE username=:username";
                    $sstmt = $conn->prepare($ssql);
                    $sstmt->bindParam(':username', $user->username);
                    $sstmt->execute();
                    $usr = $sstmt->fetch(PDO::FETCH_ASSOC);
                    if ($usr) {
                        $id = $usr['id'];
                        $sql = "UPDATE `user` SET `fname`= '$fname',`lname`= '$lname', `Address`='$address', 
                    `email`= '$email',`birthdate`='$birthdate', `phoneNumber` ='$phoneNumber', `role`='$role'   WHERE id = $id";
                        $stmt = $conn->prepare($sql);
                    }
                } else {
                    $sql = "INSERT INTO `user`(`fname`, `lname`, `username`,`sex`, `email`, `phoneNumber`, `password`, `Address`, `birthdate`, `role`, `joinedDate`) 
                VALUES (:fname,:lname,:username,:sex,:email,:phoneNumber,:passwords,:addresss,:birthdate,:roles,:joinedDate)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':passwords', $password);
                    $stmt->bindParam(':sex', $sex);
                    $fname = testInput($user->fname);
                    $joinedDate = date('Y-m-d');
                    $stmt->bindParam(':fname', $fname);
                    $stmt->bindParam(':lname', $lname);
                    $stmt->bindParam(':username', $username);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':phoneNumber', $phoneNumber);
                    $stmt->bindParam(':addresss', $address);
                    $stmt->bindParam(':birthdate', $birthdate);
                    $stmt->bindParam(':roles', $role);
                    $stmt->bindParam(':joinedDate', $joinedDate);
                }
                $okay = false;
                try {
                    $stmt->execute();
                    $okay = true;
                    // Display a success message to the user

                } catch (PDOException $e) {
                    echo $e;
                }

                if ($okay) {
                    $response = ['status' => 1, 'message' => 'Record created successfully.'];
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to create record.'];
                }
                echo json_encode($response);
            }
        }

        /**
         * 
         * 
         * TASK ALLOCATION CODE DONE BELOW;
         * 
         * 
         */
        else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Task') {
            $Task = json_decode(file_get_contents('php://input'));

            $sql = "INSERT INTO `tasktab`(`title`,`location`, `time` ,`added`) 
                    VALUES (:title,:locations,:timess,:added)";
            $stmt = $conn->prepare($sql);
            $added = new DateTime();
            $addedString = $added->format('Y-m-d H:i:s');
            $stmt->bindParam(':added', $addedString);
            $title = testInput($Task->taskTitle);
            $location = testInput($Task->location);
            $num = testInput($Task->numberOfPersons);
            $time = testInput($Task->startingTime);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':timess', $time);
            $stmt->bindParam(':locations', $location);


            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record updated successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to update record.'];
            }
            echo json_encode($response);
            $tsql = "SELECT * from tasktab where title='$title' limit 1";
            $tstmt = $conn->prepare($tsql);
            $tstmt->execute();
            $tas = $tstmt->fetch(PDO::FETCH_ASSOC);
            $task_id = $tas['id'];
            //pick member who his/her order      
            for ($a = 1; $a <= $num; $a++) {
                $user_id = pickMember();
                allocateTask($task_id, $user_id);
            }
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Task/mytask') {
            $userReq = json_decode(file_get_contents('php://input'));
            if (!empty($userReq->seen)) {
                $sql = "UPDATE `works_on` SET `seen`= :seen
                         where user_id=:user_id and task_id=:id ORDER BY `works_on`.`allocated_date` DESC";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':user_id', $userReq->user_id);
                $stmt->bindParam(':id', $userReq->id);
                $stmt->bindParam(':seen', $userReq->seen);
                if ($stmt->execute()) {
                    echo 'okay';
                } else {
                    echo ' not okay';
                }
            } else {
                $usrn = $userReq->username;
                $sql = "SELECT `tasktab`.*, `works_on`.seen, `user`.id as user_id from `user` 
                right join `works_on` on `user`.`Id`=`works_on`.`user_id` 
                join `tasktab` on `tasktab`.`id`=`works_on`.`task_id` 
                where username=:username ORDER BY `works_on`.`allocated_date` ASC";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':username', $usrn);
                if ($stmt->execute()) {
                    $urtask = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    echo json_encode($urtask);
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to fetch record.'];
                    echo json_encode($response);
                }
            }
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/voting') {
            $vote = json_decode(file_get_contents('php://input'));
            $username = $vote->username;
            $votee = $vote->votee;
            $csql = "SELECT id FROM `candidate` WHERE username=:username";
            $cstmt = $conn->prepare($csql);
            $cstmt->bindParam(':username', $username);
            $cstmt->execute();

            $cand = $cstmt->fetch(PDO::FETCH_ASSOC);
            $cand_id = $cand['id'];

            $vsql = "INSERT INTO `vote`( `candidate_id`, `votee_username`) 
                     VALUES (:cand_id,:votee)";
            $vstmt = $conn->prepare($vsql);

            $vstmt->bindParam(':votee', $votee);
            $vstmt->bindParam(':cand_id', $cand_id);
            try {
                $response = ['status' => 1, 'message' => 'voted successfully.'];
                $vstmt->execute();
            } catch (PDOException $e) {
                $response = ['status' => 1, 'message' => 'voted already.'];
            }

            echo json_encode($response);
        } else if ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/voting/check') {
            $vote = json_decode(file_get_contents('php://input'));
            $votee = $vote->username;
            $sql = "SELECT * FROM vote where votee_username='$votee'";
            $stmt = $conn->prepare($sql);
            try {
                $stmt->execute();
                $rowCount = $stmt->rowCount();
                if ($rowCount > 0) {
                    $response = ['status' => 1, 'voted' => true];
                } else {
                    $response = ['status' => 1, 'voted' => false];
                }
            } catch (PDOException $e) {

                $response = ['status' => 1, 'voted' => false];
            }

            echo json_encode($response);
        } elseif ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/candidate') {

            $candidate = json_decode(file_get_contents('php://input'));
            $username = $candidate->username;
            $letter = testInput($candidate->letter);
            $education = testInput($candidate->education);

            //find the last election id
            $sql = "SELECT *FROM `election` order by round desc";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $electionInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $frow = $electionInfo[0];
            $electionID = $frow['id'];

            // check if already in candidate

            $csql = "SELECT * FROM candidate where username='$username' and election_id=$electionID";
            $cstmt = $conn->prepare($csql);
            $cstmt->execute();
            $rowCount = $cstmt->rowCount();
            if ($rowCount > 0) {
                $response = ['status' => 1, 'message' => 'you are already requested.'];
            } else {
                $sql = "INSERT INTO `candidate`(`election_id`, `username`, `letter`, `education`) 
            VALUES (:election,:username,:letter,:education)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':election', $electionID);
                $stmt->bindParam(':education', $education);
                $stmt->bindParam(':letter', $letter);
                $stmt->bindParam(':username', $username);
                try {
                    $stmt->execute();
                    $response = ['status' => 1, 'message' => 'request sent successfully.'];
                } catch (PDOException $e) {
                    $response = ['status' => 0, 'message' => 'Failed to be candidate. u requested before or something else happen'];
                }
            }

            echo json_encode($response);
        } elseif ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/candidate/approval') {
            $candidate = json_decode(file_get_contents('php://input'));
            $username = $candidate->username;
            $accepted = $candidate->accepted;
            $sql = "UPDATE `candidate` SET `candidate`.`accepted`=:accepted WHERE `candidate`.`username`=:username";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':accepted', $accepted);
            $stmt->bindParam(':username', $username);
            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'candidate approval done successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to approve.'];
            }
            echo json_encode($response);
        } elseif ($_SERVER['REQUEST_URI'] === '/Edir/edir_api/user/Election/start') {
            $election = json_decode(file_get_contents('php://input'));
            $start = $election->start;
            //i use to end or startt based on the value of start the vote here this come from frontend part

            $sql = "SELECT *FROM `election` order by round desc";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $electionInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $frow = $electionInfo[0];
            $round = $frow['round'];
            if ($start) {
                if ($electionInfo) {
                    $frow = $electionInfo[0];
                    $round = $frow['round'];
                    $round += 1;
                } else {
                    $round = 1;
                }
                $startDate = date('Y-m-d');
                $endDate = date('Y-m-d', strtotime('+3 days'));
                $Esql = "INSERT INTO `election`(`startDate`, `round`, `endDate`, `done`) 
                     VALUES ('$startDate','$round','$endDate',0)";
                $Estmt = $conn->prepare($Esql);
                try {
                    if ($Estmt->execute()) {
                        $response = ['status' => 1, 'message' => 'Election Started successfully.', 'started' => true];
                        anounceMember("This is election time, so you can vote and can be elected.  
                                        you send candidate request from now!! election will be started in two days");
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to Start election.', 'started' => false];
                    }
                } catch (PDOException $ex) {
                    echo $ex;
                }
                echo json_encode($response);
            } elseif (!$start) {
                EndElection($round);
                $response = ['status' => 0, 'message' => 'the election ended.', 'end' => true];
                echo  json_encode($response);
            } else {
                EndElection($round);
                $response = ['status' => 0, 'message' => 'Failed to Start election.', 'started' => false];
                echo  json_encode($response);
            }
        }
        break;

    case "PUT":
        $path = explode('/', $_SERVER['REQUEST_URI']);
        $ssql = "SELECT id from user WHERE username=:username";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $path[3]);
        $stmt->execute();
        $usr = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usr) {
            $id = $usr['id'];
            $user = json_decode(file_get_contents('php://input'));
            $sql = "UPDATE user SET fname= :fname,lname= :lname, `address`=:addresss, 
                    email= :email,sex=:sex,birthdate=:birthdate, phoneNumber =:phoneNumber, 'role'=:roles   WHERE id = $id";
            $stmt = $conn->prepare($sql);

            $updated_at = date('Y-m-d');
            $fname = testInput($user->fname);
            $lname = testInput($user->lname);
            $username =  CreateUserName($fname, $lname);

            $stmt->bindParam(':fname', testInput($user->fname));
            $stmt->bindParam(':lname', testInput($user->lname));
            $stmt->bindParam(':phoneNumber', testInput($user->phoneNumber));
            $stmt->bindParam(':email', testInput($user->email));
            $stmt->bindParam(':sex', testInput($user->sex));
            $stmt->bindParam(':roles', testInput($user->role));
            $stmt->bindParam(':addresss', testInput($user->address));
            $stmt->bindParam(':birthdate', testInput($user->birthdate));
            $stmt->bindParam(':username', $username);

            $stmt->bindParam(':updated_at', $updated_at);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record updated successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to update record.'];
            }
            echo json_encode($response);
        }
        break;

    case "DELETE":
        $sql = "DELETE FROM user WHERE username = :username";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $path[3]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
}

function allocateTask($task_id, $user_id)
{
    $obj = new DbConnect;
    $conn = $obj->connect();

    $tsql = "SELECT * from tasktab where id='$task_id'";
    $tstmt = $conn->prepare($tsql);
    $tstmt->execute();
    $tas = $tstmt->fetch(PDO::FETCH_ASSOC);
    if ($tas !== false) {
        $date = $tas['time'];
        // Use the $date value or perform further operations
    }

    $sql = "INSERT INTO `works_on`(`task_id`, `user_id`, `allocated_date`, `participated`) 
          VALUES ('$task_id','$user_id','$date',0)";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
}
function pickMember()
{
    $obj = new DbConnect;
    $conn = $obj->connect();

    // Retrieve all users
    $sql = "SELECT * FROM user";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Initialize an array to store the user participations count
    $participationsCount = [];

    // Iterate through each user and count their participations
    foreach ($users as $user) {
        $userid = $user['id'];
        $sql = "SELECT COUNT(*) AS count FROM works_on WHERE user_id='$userid'";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $participationsCount[$userid] = $result['count'];
    }

    // Sort the users based on the participations count
    asort($participationsCount);

    // Find the user with the least participations
    foreach ($participationsCount as $userid => $count) {
        if ($count == 0) {
            return $userid;
        }
    }
    // If no user with 0 participations found, return the user with the least participations
    return key($participationsCount);
}

function CreateUserName($fname, $lname)
{
    $obj = new DbConnect;
    $conn = $obj->connect();

    $lname = strtolower($lname);
    $fname = strtolower($fname);

    $userNameTaken = true;
    $n = 0;
    $username = $fname;
    while ($userNameTaken) {
        $rowCount = 1;
        $sql = "SELECT * FROM user where `username`=:username";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $rowCount = $stmt->rowCount();

        if ($rowCount != 0) {
            if (substr($lname, 0, $n) != $lname) {
                $username = $fname . substr($lname, 0, $n);
                $n++;
            } else {
                $username = $fname . substr($lname, 0) . $n;
                $n++;
            }
        } else {
            $userNameTaken = false;
            return $username;
        }
    }
}

function anounceMember($message)
{

    $obj = new DbConnect;
    $conn = $obj->connect();

    $adm = "SELECT username from user where `role`='admin' limit 1";
    $Astmt = $conn->prepare($adm);
    $Astmt->execute();
    $userInfo = $Astmt->fetch(PDO::FETCH_ASSOC);

    $sender = $userInfo['username'];
    $sql = "INSERT INTO `eventtab` (`message`, `sender`, `sent_date`) VALUES (:messagee, :sender, :sent_date)";
    $stmt = $conn->prepare($sql);
    $sender = 'after'; // Assuming 'asas' is the desired sender value
    $sent_date = date('Y-m-d');

    $stmt->bindParam(':messagee', $message, PDO::PARAM_STR);
    $stmt->bindParam(':sender', $sender, PDO::PARAM_STR);
    $stmt->bindParam(':sent_date', $sent_date, PDO::PARAM_STR);
    $stmt->execute();
    //  echo json_encode($response);
}

function EndElection($round)
{
    $obj = new DbConnect;
    $conn = $obj->connect();

    $Rsql = "SELECT candidate_id, COUNT(*) AS repetition_count,
            (SELECT COUNT(*) FROM vote) AS total_row_count 
            FROM vote
            GROUP BY candidate_id;";
    $sql = "DELETE FROM `vote` WHERE 1";
    $stmt = $conn->prepare($sql);

    resultElection();
    $stmt->execute();
    $Esql = "UPDATE `election` SET `done`=1 WHERE `round`=$round";
    $Estmt = $conn->prepare($Esql);
    try {
        $Estmt->execute();
        //     anounceMember("the election is done; pls wait a little for election result, to know who win...");
    } catch (PDOException $e) {
        echo "no data world";
    }
}

function resultElection()
{
    $obj = new DbConnect;
    $conn = $obj->connect();

    $Rsql = "SELECT candidate_id, COUNT(*) AS repetition_count,
            (SELECT COUNT(*) FROM vote) AS total_row_count 
            FROM vote
            GROUP BY candidate_id order by repetition_count desc";
    $stmt = $conn->prepare($Rsql);
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $winner = $res[0];
    $id = $winner['candidate_id'];

    $Wsql = "SELECT `candidate`.`username`,`user`.`fname`, `user`.`lname` from `candidate` join 
            `user` on  `candidate`.`username`=`user`.`username` where `candidate`.`id`=$id";

    //let me update win status
    //later

    $Wstmt = $conn->prepare($Wsql);
    $Wstmt->execute();
    $WinInf = $Wstmt->fetch(PDO::FETCH_ASSOC);

    anounceMember("The election is done; the Winner is: " . $WinInf['fname'] . " " . $WinInf['lname']);
}
