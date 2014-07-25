<?php
	$regions = [];
	$departments = [];
	$handle = opendir('.');
	while (false !== ($entry = readdir($handle))) {
		if (substr($entry,-4) == ".csv") {
			process_file($entry);
		}
	}
	
	function process_file($entry) {
		global $regions,$departments;
		$region = substr($entry,0,strpos($entry," "));
		$handle = fopen($entry,"r");
		$headings = fgetcsv($handle);
		$line = fgetcsv($handle);
		while(strtolower($line[0]) != "total") {
			$departments[ucwords(strtolower($line[0]))] = $line[1];
			$line = fgetcsv($handle);
		}
		$regions[$region] = $line[1];
	}

	print_r($regions);

	$handle = fopen("regions.csv","w");
	fwrite($handle,"region,total\n");
	foreach (array_keys($regions) as $region) {
		echo $region;
		fwrite($handle,$region . "," . $regions[$region] . "\n");
	}
	fclose($handle);

	$handle = fopen("departments.csv","w");
	fwrite($handle,"department,total\n");
	foreach (array_keys($departments) as $department) {
		fwrite($handle,$department . "," . $departments[$department] . "\n");
	}
	fclose($handle);

?>
