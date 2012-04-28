<?php
/**
 * Get the settings file for database access
 *
 * @author Johnathan Pulos
 */
require_once('config/settings.php');
/**
 * Connect to the database using settings from the settings file
 *
 * @author Johnathan Pulos
 */
$link = mysql_connect($db_settings['host'], $db_settings['user'], $db_settings['password']);
/**
 * If the connecting fails, throw an error
 *
 * @author Johnathan Pulos
 */
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
/**
 * Select the correct database to search
 *
 * @author Johnathan Pulos
 */
mysql_select_db("html_country_search") or die("Unable to select database"); 
/**
 * Sanitize the data passed, to protect from hackers
 *
 * @author Johnathan Pulos
 */
$country = strtoupper(mysql_real_escape_string(addslashes($_GET['country'])));
/**
 * Run the database query
 *
 * @author Johnathan Pulos
 */
$query = sprintf("SELECT * FROM `countries` WHERE name='%s'", $country);
$sql = mysql_query($query);
if(mysql_num_rows($sql) > 0) {
	echo 'success';
}else {
	echo 'error';
}
/**
 * Close the connection
 *
 * @author Johnathan Pulos
 */
mysql_close($link);
?>