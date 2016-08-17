var $ = function(name) {
	return document.querySelector(name);
};

function clsStimulusSys(spacecraft, speed, expend) {
	this.speed = speed || 1;
	this.expend = expend || 10;
	if( typeof this.fly != "function" ) {
		clsStimulusSys.prototype.fly = function(spacecraft) {
			spacecraft.flying = true;
			var speed = this.speed,
				expend = this.expend;
			spacecraft.selfElement.src = "firedspacecraft.png";
			spacecraft.selfElement.className += " fired-spacecraft";
			var delay = 10,
				_this = this;
			this.timer = setInterval(function() {
				if( spacecraft.power <= 0 ) {
					spacecraft.power = 0;
					_this.stopFlying(spacecraft);
					return ;
				}
				spacecraft.selfElement.style.left = spacecraft.circle.x - spacecraft.circle.radius * Math.cos(spacecraft.circle.angle * Math.PI / 180) + "px";
				spacecraft.selfElement.style.top = spacecraft.circle.y - spacecraft.circle.radius * Math.sin(spacecraft.circle.angle * Math.PI / 180) + "px";
				spacecraft.selfElement.style.transform = "rotate(" + spacecraft.circle.angle + "deg)";
				spacecraft.power -= expend / (1000 / delay);
				spacecraft.circle.angle += speed;
				if( spacecraft.circle.angle >= 360 ) spacecraft.circle.angle = 0;
			}, delay);
		};

		clsStimulusSys.prototype.stopFlying = function(spacecraft) {
			spacecraft.flying = false;
			if( this.timer ) clearInterval(this.timer);
			spacecraft.selfElement.src = "spacecraft.png";
			spacecraft.selfElement.style.left = spacecraft.selfElement.offsetLeft + 5 + "px";
			spacecraft.selfElement.style.top = spacecraft.selfElement.offsetTop + 5 + "px";
			spacecraft.selfElement.className = spacecraft.selfElement.className.replace(/ fired-spacecraft/, "");
		};
	}
}

function clsEnergySys(spacecraft, speed) {
	this.speed = speed || 5;
	if( typeof this.recover != "function" ) {
		clsEnergySys.prototype.recover = function(spacecraft) {
			var speed = this.speed,
				delay = 100,
				timer;
			timer = setInterval(function() {
				spacecraft.power += speed / 10;
				if( spacecraft.power > 100 ) spacecraft.power = 100;
			}, delay);
		}
	}
	this.recover(spacecraft);
}

function clsSignalReceptionSys(spacecraft) {
	if( typeof this.receive != "function" ) {
		clsSignalReceptionSys.prototype.receive = function(message, spacecraft) {
			if( message.id != spacecraft.id ) return ;
			switch( message.command ) {
				case "start": spacecraft.fly(); break;
				case "stop": spacecraft.stopFlying(); break;
				case "destroy": spacecraft.destroy(); break;
			}
		};
	}
}

function clsSpaceCraft(track) {
	this.id = track;
	this.power = 100;
	this.circle = {
		radius: 150 + 72 * (track - 1),
		x: 340,
		y: 330,
		angle: 0
	};
	this.selfElement = document.createElement("img");
	this.stimulusSys = new clsStimulusSys(this);
	this.energySys = new clsEnergySys(this);
	this.signalReceptionSys = new clsSignalReceptionSys(this);
	this.flying = false;

	if( typeof this.show != "function" ) {
		clsSpaceCraft.prototype.show = function(track) {
			this.selfElement.src = "spacecraft.png";
			this.selfElement.className = "spacecraft-img spacecraft-" + track;
			trackWrap = $(".track-wrap" + track);
			trackWrap.insertBefore(this.selfElement, trackWrap.lastElementChild);
		};
		clsSpaceCraft.prototype.fly = function() {
			if( this.flying ) return ;
			this.stimulusSys.fly(this);
		};
		clsSpaceCraft.prototype.stopFlying = function() {
			if( !this.flying ) return ;
			this.stimulusSys.stopFlying(this);
		};
		clsSpaceCraft.prototype.destroy = function() {
			this.selfElement.parentNode.removeChild(this.selfElement);
			this.stimulusSys.stopFlying(this);
		};
	}
	this.show(track);
}

function clsMessage(id, command) {
	this.id = id;
	this.command = command;
}

(function() {
	var singleMediator = (function() {
		return {
			lossRate: 0,
			delay: 0,
			send: function(message, tracks, target) {
				if( Math.random() <= this.lossRate ) {
					target.disabled = false;
					return ;
				}
				setTimeout(function() {
					if( message.command == "ready" ) {
						tracks[message.id - 1] = new clsSpaceCraft(message.id);
						var div = document.createElement("div");
						div.className = "track-" + message.id;
						div.innerHTML = '<label>对' + message.id + '号飞船下达指令：</label><button class="control-button" name="start-button" type="button">开始飞行</button><button class="control-button" name="stop-button" type="button">停止飞行</button><button class="control-button" name="destroy-button" type="button">销毁飞船</button>';
						target.parentNode.parentNode.insertBefore(div, target.parentNode);
					}
					else {
						for( var i = 0, len = tracks.length; i < len; ++ i ) {
							if( tracks[i] ) {
								tracks[i].signalReceptionSys.receive(message, tracks[i]);
							}
						}
						if( message.command == "destroy" ) {
							target.parentNode.parentNode.removeChild(target.parentNode);
							tracks[message.id - 1] = null;	
						}
					}
					target.disabled = false;
				}, this.delay);
			}
		};

	})();

	var controlDiv = $(".control-wrap");
	var tracks = [null, null, null, null];
	function buttonHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event),
			num = parseInt(target.parentNode.className.slice(-1)),
			message;
		switch( target.name ) {
			case "ready-button":
				for( var i = 0, len = tracks.length; i < len; ++ i ) {
					if( tracks[i] == null ) break;
				}
				if( i == tracks.length ) {
					alert("最多只能创建4架宇宙飞船！");
					return ;
				}
				message = new clsMessage(i + 1, "ready");
				break;
			case "start-button": message = new clsMessage(num, "start"); break;
			case "stop-button": message = new clsMessage(num, "stop"); break;
			case "destroy-button": message = new clsMessage(num, "destroy"); break;
			default: return;
		}
		target.disabled = true;
		singleMediator.send(message, tracks, target);
	}
	EventUtil.addHandler(controlDiv, "click", buttonHandler);
})();
