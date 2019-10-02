<?php
	$page = 0;
	$record_result = array();
	
	function getRecordsByPage() {
		
		global $record_result, $page;
		
		$url = "http://dev.interactivemechanics.com/spit-spreads-death/cms/api/explorer/records?_format=json&page=" . $page;
		$ch = curl_init();
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL, $url);
		
		$temp_result = curl_exec($ch);
		curl_close($ch);
		
		$record_result = array_merge($record_result, json_decode($temp_result));		
		print_r("Death Records (Page " . $page . ") data cached. <br/>");
		
		printRecords();
		
	}
	
	function printRecords() {
		
		global $record_result, $page;
	
		if ($record_result){
									
			if (count($record_result) % 1000 == 0){
				
				$page++;
				getRecordsByPage();
				
			} else {
				
				$fp = fopen("./cache/data.json", "w");
				fwrite($fp, print_r(json_encode($record_result), TRUE));
				fclose($fp);
				
				print_r("<br/> Data caching complete! <br/><br/>");
				
			}
		}		
	}
	
	getRecordsByPage();
	