<?php
	$urlbase = "http://exhibit.spitspreadsdeath.com";
	
	$url_nabe = "/cms/api/explorer/neighborhoods?_format=json";
	$url_poi = "/cms/api/explorer/points?_format=json";
	
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
			
			$search = array(
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-12\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-11\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-10\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-09\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-08\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-07\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-06\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-05\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-04\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-03\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-02\/',
				'\/spit-spreads-death\/cms\/sites\/default\/files\/2019-01\/',
			);
			
			$temp_decode_result_replaced = str_replace($search, '.\/cache\/files\/', json_encode($temp_decode_result));
			
			fwrite($fp, print_r($temp_decode_result_replaced, TRUE));
			print_r($message);
		}
	
		curl_close($ch);
		fclose($fp);
	}
	
	function deleteExistingImages() {
		$images = glob('./cache/files/*');
		foreach($images as $file){
		  	if(is_file($file))
		    	unlink($file);
		}
		
		$files = glob('./cache/files/*');
		foreach($files as $file){
		  	if(is_file($file))
		    	unlink($file);
		}
		
		print_r("Previously downloaded files deleted.<br/><br/>");
	}
	
	function loopThroughAndGetFiles() {
		
		global $result, $urlbase;
		
		foreach($result as $key => $value) {
			
			$doc = new DOMDocument();
			@$doc->loadHTML($value->content);
			$xml = simplexml_import_dom($doc);
			
			$images = $xml->xpath('//img[not(contains(@src, "?itok"))]');
			foreach ($images as $img) {			    
			    $basename = urldecode(basename((string) $img['src']));
			    
				copy($urlbase . (string) $img['src'], './cache/files/' . $basename);
				print_r("Downloaded image: " . $basename . "<br/>");
			}
			
			$files = $xml->xpath('//source');			
			foreach ($files as $file) {
			    $basename = urldecode(basename((string) $file['src']));
			    
				copy($urlbase . (string) $file['src'], './cache/files/' . $basename);
				print_r("Downloaded file: " . $basename . "<br/>");
			}
		}
	}
	
	getJsonData($url_poi, "./cache/data_poi.json", "Point of Interest data cached. <br/>");
	getJsonData($url_nabe, "./cache/data_neighborhoods.json", "Neighborhood data cached. <br/><br/>");
	
	deleteExistingImages();
	loopThroughAndGetFiles();

	print_r("<br/> Data caching complete!");
	