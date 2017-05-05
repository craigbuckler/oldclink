<?php
// requested URL
$addr = strtolower($_SERVER['REQUEST_URI']);
$url = '';

$pAbout = 'about-old-clink/';
$pBS = 'about-budleigh-salterton/';
$pBook = 'book-holiday-home/';
$pDir = 'book-holiday-home/travel/';
$pTerms = 'book-holiday-home/terms/';

// redirects
$redir = array(

	'index' => '',
	'welcome' => '',
	'annex' => 'apartment-1-annexe/',
	'flat' => 'apartment-2-flat/',
	'term' => $pTerms,
	'cond' => $pTerms,
	'stay' => $pAbout,
	'accommodat' => $pAbout,
	'apartment' => $pAbout,
	'home' => $pAbout,
	'holiday' => $pBS,
	'bud' => $pBS,
	'salt' => $pBS,
	'beach' => $pBS,
	'devon' => $pBS,
	'locat' => $pBS,
	'area' => $pBS,
	'place' => $pBS,
	'visit' => $pDir,
	'trav' => $pDir,
	'drive' => $pDir,
	'train' => $pDir,
	'air' => $pDir,
	'fly' => $pDir,
	'direct' => $pDir,
	'call' => $pBook,
	'contact' => $pBook,
	'query' => $pBook,
	'quiry' => $pBook,
	'book' => $pBook,
	'reserve' => $pBook

);
foreach ($redir as $pold => $pnew) if (strpos($addr, $pold) !== false) $url = '/* @echo rootURL */' . $pnew;

if ($url !== '') {

	// redirect found
	header('HTTP/1.1 301 Moved Permanently');
	header('Location: ' . $url);

}
else {

	// show error page
	$eurl = '/* @echo rootURL */error/';

	$fcont = file_get_contents($eurl);
	if ($fcont !== false) {
		header('HTTP/1.0 404 Not Found');
		echo $fcont;
	}
	else header('Location: ' . $eurl);

}
