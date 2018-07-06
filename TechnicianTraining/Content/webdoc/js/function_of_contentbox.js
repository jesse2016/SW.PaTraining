//to bind functions to the toolbar
var FunctionOfContentBox = function()
{
	var ContentBox = document.getElementsByClassName("newContent"),
		count = ContentBox.length;
		
	for(n=0;n<count;n++)
	{
		ContentBox.item(n).onkeydown = function(event)
		{
			//force to remove the new tag of div or p
			if(event.keyCode==13 || event.charCode == 13){
				var br = document.createElement("br");
				window.getSelection().getRangeAt(0).insertNode(br);
				return false;
			}
		}
		ContentBox.item(n).onmouseup = function()
		{
			var ContentCurrent = this;
			var ContentInner = this.innerHTML;
			//setColor
			var colorTarget = document.getElementById("setColor").getElementsByTagName("b");
			var colorCount = colorTarget.length;
			for(o=0;o<colorCount;o++)
			{
				colorTarget.item(o).onclick = function()
				{
					var color = this.getAttribute("data-color");
					document.execCommand("ForeColor",false,color);
				}
			}
			//setBold
			document.getElementById("Bold").onclick = function()
			{
				document.execCommand("bold",false) 
			}
			//setFontSize
			var fontSizeRange = document.getElementById("FontSize").getElementsByTagName("b");
			for(x=0;x<fontSizeRange.length;x++)
			{
				fontSizeRange.item(x).onclick = function()
				{
					console.log("x:"+parseInt(this.innerText))
					document.execCommand("FontSize",false,parseInt(this.innerText)) 
				}
			}
			//WashStyle
			document.getElementsByClassName("Clear").item(0).onclick = function()
			{
				ContentCurrent.innerHTML = WashStyle(ContentCurrent.innerHTML);
			}
		}
	}
}