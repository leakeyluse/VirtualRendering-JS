"use strict";

var itemHolder = document.getElementById("itemHolder");
itemHolder.innerHTML = "";

var focusedRowID = 0,
	rowCount = 1200001;

function createRow(i)
{
    var row = document.createElement("div");
	row.classList.add("item");
	row.style.position = "absolute";
	row.setAttribute("tabindex", "0");
	row.setAttribute("rn", i);
	row.style.top = (i * itemHeight) + "px";
	row.style.left = "0px";
	row.style.right = "0px";
	row.innerHTML = "Hello. This is me, item " + i;
	
	return row;
}

function createScrollBar(h) 
{
	var scrollBar = document.createElement('div');
	scrollBar.style.opacity = 0;
	scrollBar.style.position = 'absolute';
	scrollBar.style.top = 0;
	scrollBar.style.left = 0;
	scrollBar.style.width = '1px';
    scrollBar.style.height = h + 'px';
    
	return scrollBar;
};

function renderChunk(itemHolderNode, firstItem)
{
	var lastItem = firstItem + cachedItemsLen;
    if (lastItem > totalRows) 
    {
		lastItem = totalRows;
	}
	
	var frag = document.createDocumentFragment();
	
    for(var i = firstItem; i < lastItem; i++) 
    {
        if(i >= (screenItemsLen - 1) && i % (screenItemsLen - 1) == 0) 
        {
			frag.appendChild(createRow(i));
			continue;
		}
		frag.appendChild(createRow(i));
	}
	
    for (var j = 1, l = itemHolderNode.childNodes.length; j < l; j++) 
    {
		itemHolderNode.childNodes[j].style.display = "none";
		itemHolderNode.childNodes[j].setAttribute("badnode", "true");
	}
	
	itemHolderNode.appendChild(frag);
}

function restoreFocus() 
{
    setInterval(function()
    {
		var rowToFocus = itemHolder.querySelector("[rn=\"" + focusedRowID + "\"]");
		if(rowToFocus) { rowToFocus.focus(); }
	}, 5);
}

var itemHeight = (function()
{
	var DEBUG = document.createElement("div");
	DEBUG.className = "item";
	DEBUG.innerHTML = "M";
	DEBUG.style.visibility = "hidden";
	document.body.appendChild(DEBUG);
	var thisHeight = DEBUG.offsetHeight;
	document.body.removeChild(DEBUG)
	return thisHeight;
}());

function scrollToRow(rowNumber) 
{
	focusedRowID = rowNumber - 1;
	itemHolder.scrollTop = itemHeight * rowNumber;
	restoreFocus();
}

var totalRows = rowCount,
	itemHolderHeight = itemHolder.offsetHeight,
	screenItemsLen = Math.ceil(itemHolderHeight / itemHeight),
	cachedItemsLen = screenItemsLen * 3,
	lastScrolled = 0,
	lastRepaintY,
	maxBuffer = screenItemsLen * itemHeight;

var rmNodeInterval = setInterval(function() 
{
    if (Date.now() - lastScrolled > 100) 
    {
		var badNodes = itemHolder.querySelectorAll("[badnode]");
        for (var i = 0, l = badNodes.length; i < l; i++) 
        {
			itemHolder.removeChild(badNodes[i]);
		}
    }
}, 250);
	
var scrollBar = createScrollBar(itemHeight * totalRows);
itemHolder.appendChild(scrollBar);

renderChunk(itemHolder, 0);
restoreFocus();

itemHolder.addEventListener("scroll", function(e) 
{
	var scrollTop = e.target.scrollTop;
	
    if (!lastRepaintY || Math.abs(scrollTop - lastRepaintY) > maxBuffer) 
    {
		var first = parseInt(scrollTop / itemHeight) - screenItemsLen;
		renderChunk(itemHolder, first < 0 ? 0 : first);
		lastRepaintY = scrollTop;		
    }
	
	parseInt(scrollTop / itemHeight);
	lastScrolled = Date.now();
	restoreFocus();
}, false);

document.body.addEventListener("focus", function(e) 
{
    if(e.target.classList.contains("item")) 
    {
		focusedRowID = parseInt(e.target.getAttribute("rn"));
		e.target.scrollIntoViewIfNeeded(true);
	}
}, true);

document.body.addEventListener("keydown", function(e) 
{
	var rowToFocus;
    if(e.target.classList.contains("item")) 
    {
        if(e.keyCode == 33) // PAGEUP
        { 
			var tf = document.elementFromPoint(5, itemHeight/2);
			var rect = tf.getBoundingClientRect();
			alert(rect.top);
			return;
			scrollToRow (parseInt(tf.getAttribute("rn")));
			tf.focus();
			return;
        }
        
        if(e.keyCode == 34) // PAGEDOWN
        { 
			document.elementFromPoint(5, window.innerHeight - itemHeight).focus();
			return;
        }
        
        if(e.keyCode == 35) // END
        { 
			scrollToRow(rowCount);
			return;
        }
        
        if(e.keyCode == 36) // HOME
        { 
			scrollToRow(1);
			return;
        }
        
        if(e.keyCode == 38) // UP
        { 
			e.preventDefault();
			rowToFocus = e.target.previousElementSibling;
        }
        
        if(e.keyCode == 40) // DOWN
        {
			e.preventDefault();
			rowToFocus = e.target.nextElementSibling;
		}
		
		if(rowToFocus) { rowToFocus.focus(); return; }
    }
    
	if(!rowToFocus)
	{
        if(e.keyCode == 38) 
        {
			focusedRowID = focusedRowID > 0 ? --focusedRowID : 0;
			cont.scrollTop = itemHeight * focusedRowID;
        }
        
        if(e.keyCode == 40) 
        {
			focusedRowID = focusedRowID < rowCount ? ++focusedRowID : rowCount;
			cont.scrollTop = itemHeight * focusedRowID;
		}
	}
}, false);
