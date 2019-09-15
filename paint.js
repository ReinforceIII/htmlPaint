	var canvas, context, context_real, tool, curColor, curWidth, fillobj;
	
	function InitEvent(){
		var canvas_real = document.getElementById("drawCanvas");
		context_real = getContext(canvas_real);
		
		canvas = document.getElementById("bufferCanvas");
		context = getContext(canvas);
		
		if(!context_real || !context)
			return;
		
		curColor = context.strokeStyle;
		curWidth = context.lineWidth;
		fillobj = false;
		
		tool = new tool_pencil();
		
		canvas.addEventListener("mousedown", ev_canvas, false);
		canvas.addEventListener("mousemove", ev_canvas, false);
		canvas.addEventListener("mouseup", ev_canvas, false);
	} 
	
	function getContext(canvas){
		if(!canvas){
			alert("Cannot find Canvas ");
			return null;
		}
		
		if(!canvas.getContext){
			alert("Cannot Find Drawing Context ");
			return null;
		}
		
		var context = canvas.getContext("2d");
		
		if(!context){
			alert("Cannot Call getContext() ");
			return null;
		}
		
		return context;
	}
	
	//펜 자유 그림	
	function tool_pencil (){
		var tool = this;
		this.started = false;
		
		context.strokeStyle = curColor;
		context.lineWidth = curWidth;
		
		
		this.mousedown = function (occur){
			context_real.beginPath();
			context_real.moveTo(occur._x, occur._y);
			tool.started = true;
		}
   
   
		this.mousemove = function (occur){
			if (tool.started)
			{
				context_real.lineTo(occur._x, occur._y);
				context_real.stroke();
			}
		}
   
   
		this.mouseup = function (occur){
			if (tool.started){
				tool.mousemove(occur);
				tool.started = false;
			}
			draw();
		}
	}
	
	//직선 그리기
	function tool_line (){
	
		var tool = this;
		this.started = false;
		
		
		this.mousedown = function(occur){
			tool.startX = occur._x;
			tool.startY = occur._y;
			tool.started = true;
		}
		
		this.mousemove = function(occur){
			if(tool.started){	
				context.beginPath();
				context.moveTo(tool.startX,tool.startY);
				context.lineTo(occur._x,occur._y);
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.stroke();
			
			}
		}
		
		this.mouseup = function(occur){
			context_real.beginPath();
			context_real.moveTo(tool.startX,tool.startY);
			context_real.lineTo(occur._x,occur._y);
			context_real.stroke();
			
			tool.started = false;
			draw();
		}
		
	}
	
	//사각형 그리기
	function tool_rectangle(){
		var tool = this;
		this.started = false;
	
		this.mousedown = function(occur){
			tool.startX = occur._x;
			tool.startY = occur._y;
			
			tool.started = true;
		}

		this.mousemove = function(occur){
			
			if (tool.started){
			
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.strokeRect(tool.startX, tool.startY, (occur._x - tool.startX), (occur._y - tool.startY));
				
				started = false;
			}
		}

		this.mouseup = function(occur){
		
			if(document.form.fillobj.checked){	
				fillobj = true;
			} 
			else if(!document.form.fillobj.checked){
				fillobj = false;
			}
			
			if(fillobj == false){
				context_real.strokeRect(tool.startX, tool.startY, (occur._x - tool.startX), (occur._y - tool.startY));
			} else{
				context_real.fillStyle = curColor;
				context_real.fillRect(tool.startX, tool.startY, (occur._x - tool.startX), (occur._y - tool.startY));
			}
			tool.started = false;
			draw();
		}
	}
	
	//타원 그리기
	function tool_circle(){ // 출처 :  http://webreflection.blogspot.kr/2009/01/ellipse-and-circle-for-canvas-2d.html 에 있는 ellipse 그리는 함수를 참고했습니다.
		var tool = this;
		this.started = false;
		
		this.mousedown = function(occur){
			tool.startX = occur.x;
			tool.startY = occur.y;
			
			tool.started = true;		
		}
		
		this.mousemove = function(occur){
		
			if(tool.started){
				context.beginPath();
				var x = tool.startX,
					y = tool.startY,
					w = (occur._x - tool.startX),
					h = (occur._y - tool.startY),
					hB = (w / 2) * .5522848,
					vB = (h / 2) * .5522848,
					eX = x + w,
					eY = y + h,
					mX = x + w / 2,
					mY = y + h / 2;
				context.moveTo(x, mY);
				context.bezierCurveTo(x, mY - vB, mX - hB, y, mX, y);
				context.bezierCurveTo(mX + hB, y, eX, mY - vB, eX, mY);
				context.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
				context.bezierCurveTo(mX - hB, eY, x, mY + vB, x, mY);
				context.closePath();
				context.clearRect(0, 0, canvas.width, canvas.height);	
				context.stroke();										
				
				started = false;
			}
		}
		
		this.mouseup = function(occur) {
		
			if(document.form.fillobj.checked){	
				fillobj = true;
			} 
			else if(!document.form.fillobj.checked){
				fillobj = false;
			}
			context_real.beginPath();
			var x = tool.startX,
				y = tool.startY,
				w = (occur._x - tool.startX),
				h = (occur._y - tool.startY),
				hB = (w / 2) * .5522848,
				vB = (h / 2) * .5522848,
				eX = x + w,
				eY = y + h,
				mX = x + w / 2,
				mY = y + h / 2;
			context_real.moveTo(x, mY);
			context_real.bezierCurveTo(x, mY - vB, mX - hB, y, mX, y);
			context_real.bezierCurveTo(mX + hB, y, eX, mY - vB, eX, mY);
			context_real.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
			context_real.bezierCurveTo(mX - hB, eY, x, mY + vB, x, mY);
			context_real.closePath();
				
			if(fillobj == false){
				context_real.stroke();
			} else{
				context_real.fillStyle = curColor;
				context_real.fill();;
			}
			tool.started = false;
			draw();
		}
	}
	
	function tool_triangle(){
		var tool = this;
		this.started=false;
		var x1,y1,x2,y2,x3,y3;
		var count = 0;
		
		this.mousedown = function(occur){
		
			if(document.form.fillobj.checked){	
				fillobj = true;
			} 
			else if(!document.form.fillobj.checked){
				fillobj = false;
			}
			
			if (count == 0){
			x1=occur._x;
			y1=occur._y;
			} else if(count == 1){
			x2=occur._x;
			y2=occur._y;
			} else{
			x3=occur._x;
			y3=occur._y;
			}
			count++;
			if(count == 3){
				context_real.beginPath();
				context_real.moveTo(x1,y1);
				context_real.lineTo(x2,y2);
				context_real.lineTo(x3,y3);
				context_real.closePath();
			
			if(fillobj == false){
				context_real.strokeStyle = curColor;
				context_real.stroke();
			} else{
				context_real.fillStyle = curColor;
				context_real.fill();;
			}
				count = 0;
			}
			
		}
	}
	function draw(){
		context_real.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	function ev_canvas(occur){
		if (occur.layerX || occur.layerX == 0){
			occur._x = occur.layerX;
			occur._y = occur.layerY;
		}

		else if (occur.offsetX || occur.offsetX == 0){
			occur._x = occur.offsetX;
			occur._y = occur.offsetY;
		}

		var func = tool[occur.type];
		if (func){
			func(occur);
		}
	}
	
	function selectPencil(){
		context_real.strokeStyle = curColor;

		tool = new tool_pencil();
		
		document.form.fillobj.disabled = true;
	}
	
	function selectLine(){
	
		context_real.strokeStyle = curColor;
		context.lineWidth = curWidth;
		
		tool = new tool_line();
		
		doucument.form.fillobj.disabled = true;
		
	}
	
	function selectRectangle(){
		
		context.strokeStyle = curColor;
		context.lineWidth = curWidth;
		
		tool = new tool_rectangle();
		
		document.form.fillobj.disabled = false;		
	}
	
	function selectCircle(){
	
		context.strokeStyle = curColor;
		context.lineWidth = curWidth;
		
		tool = new tool_circle();
		
		document.form.fillobj.disabled = false;
	}
	
	function selectTriangle() {
	
		context.strokeStyle = curColor;
		context.lineWidth = curWidth;
		
		tool = new tool_triangle();
		
		document.form.fillobj.disabled = false;
	}
	
	function selectEraser(){
		context_real.strokeStyle = '#ffffff';
		
		tool = new tool_pencil();
		
		document.form.fillobj.disabled = true;
	}
	
	function selectNew(){
		context_real.clearRect(0, 0, canvas.width, canvas.height);
	}
	

	function setColor(colors){
	
		context_real.strokeStyle = colors;
		
		context.strokeStyle = colors;
		curColor = context.strokeStyle;
	}
	
	function setThick(thick){
		context_real.lineWidth = thick;
		
		context.lineWidth = thick;
		curWidth = context.lineWidth;
	}
	