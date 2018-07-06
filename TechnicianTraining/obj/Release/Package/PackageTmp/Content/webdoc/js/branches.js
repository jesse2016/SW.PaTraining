// JavaScript Document
var Branches = {
	id : "",
	init   : function(id)
	{
		id = id;
		Branches.layout(id);
	},
	layout : function(id)
	{
		var branch = document.getElementById(id).getElementsByTagName("li");
		
		for(i=0;i<branch.length;i++)
		{
			if(branch.item(i).getElementsByTagName("p").item(0).getElementsByTagName("i").item(0).innerHTML > 0)
			{
				branch.item(i).getElementsByTagName("p").item(0).getElementsByTagName("i").item(0).setAttribute("class","on");
			}
		}
		
		for(i=0;i<branch.length;i++)
		{
			if(branch.item(i).getElementsByTagName("i").item(0).nodeValue > 0)
			{
				branch.item(i).getElementsByTagName("i").item(0).setAttribute("class","on");
			}
			if(branch.item(i).parentNode.parentNode.tagName == "LI")
			{
				branch.item(i).style.paddingLeft = branch.item(i).parentNode.parentNode.getElementsByTagName("p").item(0).offsetWidth*.8 +"px";				
				branch.item(i).getElementsByTagName("q").item(0).style.height = (branch.item(i).offsetTop - branch.item(i).parentNode.parentNode.getElementsByTagName("p").item(0).offsetHeight + branch.item(i).getElementsByTagName("p").item(0).offsetHeight/2) + "px";
				branch.item(i).getElementsByTagName("q").item(0).style.width = branch.item(i).parentNode.parentNode.getElementsByTagName("p").item(0).offsetWidth*.6/2 + "px";
				branch.item(i).getElementsByTagName("q").item(0).style.top = - (branch.item(i).offsetTop - branch.item(i).parentNode.parentNode.getElementsByTagName("p").item(0).offsetHeight - 4) + "px";
				branch.item(i).getElementsByTagName("q").item(0).style.left = branch.item(i).parentNode.parentNode.getElementsByTagName("p").item(0).offsetWidth/2 + 4 +"px";
				
			}
			branch.item(i).getElementsByTagName("p").item(0).getElementsByTagName("span").item(0).onclick = function(e){

				if(e.target = "span"){
					var ul = e.target.parentNode.parentNode.getElementsByTagName("ul");

					if(ul[0].getAttribute("class") == "off")
					{
						ul[0].setAttribute("class","on");
						Branches.layout(id);
					}
					else
					{
						ul[0].setAttribute("class","off");
						Branches.layout(id);
					}
				}
			}
		}
	}
}