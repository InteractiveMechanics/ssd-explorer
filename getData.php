<?php
	$urlbase = "http://dev.interactivemechanics.com";
	
	$url_nabe = "/spit-spreads-death/cms/api/explorer/neighborhoods?_format=json";
	$url_poi = "/spit-spreads-death/cms/api/explorer/points?_format=json";
	
	$result = array();	
	
	function getJsonData($url, $file, $message) {
		
		global $result, $urlbase;
		
		$fp = fopen($file, "w");
		$ch = curl_init();
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL, $urlbase . $url);
		
		$temp_result = curl_exec($ch);
		if ($temp_result){
			
			$temp_decode_result = json_decode($temp_result);
			$result = array_merge($result, $temp_decode_result);
			
			fwrite($fp, print_r(json_encode($temp_decode_result), TRUE));
			print_r($message);
		}
	
		curl_close($ch);
		fclose($fp);
	}
	
	function deleteExistingImages() {
		$files = glob('./cache/images/*');
		foreach($files as $file){
		  	if(is_file($file))
		    	unlink($file);
		}
		
		print_r("Previously downloaded files deleted.<br/><br/>");
	}
	
	function loopThroughAndGetImages() {
		
		global $result, $urlbase;
		
		foreach($result as $key => $value) {
			
			$doc = new DOMDocument();
			@$doc->loadHTML($value->content);
			$xml = simplexml_import_dom($doc);
			$images = $xml->xpath('//img[not(contains(@src, "?itok"))]');
			
			foreach ($images as $img) {			    
			    $basename = basename((string) $img['src']);
			    
				copy($urlbase . (string) $img['src'], './cache/images/' . $basename);
				print_r("Downloaded file: " . $basename . "<br/>");
			}
		}
	}
	
	getJsonData($url_poi, "./cache/data_poi.json", "Point of Interest data cached. <br/>");
	getJsonData($url_nabe, "./cache/data_neighborhoods.json", "Neighborhood data cached. <br/><br/>");
	
	deleteExistingImages();
	loopThroughAndGetImages();

	print_r("<br/> Data caching complete!");
	