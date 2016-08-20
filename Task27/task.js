var $ = function(selectors) {
	return document.querySelector(selectors);
};

var $$ = function(selectors) {
	return document.querySelectorAll(selectors);
};

function clsStimulusSys(spacecraft, speed, expend) {
	this.speed = ((speed / 10) || 3) - 2;
	this.expend = expend || 5;
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
				spacecraft.power -= expend * delay / 1000;
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

function clsEnergySys(spacecraft, recoverSpeed) {
	this.recoverSpeed = recoverSpeed || 2;
	if( typeof this.recover != "function" ) {
		clsEnergySys.prototype.recover = function(spacecraft) {
			var recoverSpeed = this.recoverSpeed,
				delay = 100,
				timer;
			timer = setInterval(function() {
				spacecraft.power += recoverSpeed * delay / 1000;
				if( spacecraft.power > 100 ) spacecraft.power = 100;
			}, delay);
		}
	}
	this.recover(spacecraft);
}

function clsSignalReceptionSys(spacecraft) {
	if( typeof this.receive != "function" ) {
		clsSignalReceptionSys.prototype.receive = function(message, spacecraft) {
			message = this.adapter(message);
			if( message.id != spacecraft.id ) return ;
			switch( message.command ) {
				case "start": spacecraft.fly(); break;
				case "stop": spacecraft.stopFlying(); break;
				case "destroy": spacecraft.destroy(); break;
			}
		};
		clsSignalReceptionSys.prototype.adapter = function(message){
			var newMessage = {};
			switch( message.slice(0, 4) ) {
				case "0001": newMessage.id = 1; break;
				case "0010": newMessage.id = 2; break;
				case "0100": newMessage.id = 3; break;
				case "1000": newMessage.id = 4; break;
			}
			switch( message.slice(4) ) {
				case "0010": newMessage.command = "start"; break;
				case "0100": newMessage.command = "stop"; break;
				case "1000": newMessage.command = "destroy"; break;
			}
			return newMessage;
		};
	}
}

function clsSpaceCraft(track, speed, expend, recoverSpeed) {
	this.id = track;
	this.power = 100;
	this.circle = {
		radius: 150 + 72 * (track - 1),
		x: 340,
		y: 330,
		angle: 0
	};
	this.selfElement = document.createElement("img");
	this.stimulusSys = new clsStimulusSys(this, speed, expend);
	this.energySys = new clsEnergySys(this, recoverSpeed);
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
	var commandSys = $(".command-system"),
		singleMediator = (function() {
		return {
			lossRate: 0.3,
			delay: 1000,
			send: function(message, tracks, target) {
				if( Math.random() <= this.lossRate ) {
					target.disabled = false;
					return ;
				}
				message = JSON.parse(message);
				setTimeout(function() {
					if( message.command == "ready" ) {
						tracks[message.id - 1] = new clsSpaceCraft(message.id);
						var div = document.createElement("div");
						div.className = "track-" + message.id;
						div.innerHTML = '<label>对' + message.id + '号飞船下达指令：</label><button class="control-button" name="start-button" type="button">开始飞行</button><button class="control-button" name="stop-button" type="button">停止飞行</button><button class="control-button" name="destroy-button" type="button">销毁飞船</button>';
						commandSys.appendChild(div);
					}
					else {
						for( var i = 0, len = tracks.length; i < len; ++ i ) {
							if( tracks[i] ) {
								tracks[i].signalReceptionSys.receive(message, tracks[i]);
							}
						}
						if( message.command == "destroy" ) {
							commandSys.removeChild(target.parentNode);
							tracks[message.id - 1] = null;	
						}
					}
					target.disabled = false;
				}, this.delay);
			}
		};

	})(),
		singleBus = (function() {
		return {
			lossRate: 0.1,
			delay: 300,
			adapter: function(message) {
				var newMessage;
				message = JSON.parse(message);
				switch( message.id ) {
					case 1: newMessage = "0001"; break;
					case 2: newMessage = "0010"; break;
					case 3: newMessage = "0100"; break;
					case 4: newMessage = "1000"; break;
				}
				switch( message.command ) {
					case "start": newMessage += "0010"; break;
					case "stop": newMessage += "0100"; break;
					case "destroy": newMessage += "1000"; break;
				}
				return newMessage;
			},
			send: function(message, tracks, target) {
				console.log("Try again!");
				if( Math.random() <= this.lossRate ) {
					this.send(message, tracks, target);
					return ;
				}
				setTimeout(function() {
					for( var i = 0, len = tracks.length; i < len; ++ i ) {
						if( tracks[i] ) {
							tracks[i].signalReceptionSys.receive(message, tracks[i]);
						}
					}
					if( message[4] == "1" ) {
						for( var id = 0; id < 4; ++ id ) {
							if( message[id] == "1" ) break;
						}
						id = 3 - id;
						commandSys.removeChild(target.parentNode);
						tracks[id] = null;
						console.log(tracks);
					}
					target.disabled = false;
				}, this.delay);
			}
		};
	})();

	var controlDiv = $(".control-wrap"),
		stimulusSys = $$("input[name=stimulus]"),
		energySys = $$("input[name=energy]"),
		tracks = [null, null, null, null];
	function buttonHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event),
			id = parseInt(target.parentNode.className.slice(-1)),
			command,
			speed,
			expend,
			recoverSpeed,
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
				id = i + 1;
				for( var i = 0, len = stimulusSys.length; i < len; ++ i ) {
					if( stimulusSys[i].checked ) {
						speed = stimulusSys[i].getAttribute("data-speed");
						expend = stimulusSys[i].getAttribute("data-expend");
						break;
					}
				}
				for( var i = 0, len = energySys.length; i < len; ++ i ) {
					if( energySys[i].checked ) {
						recoverSpeed = energySys[i].getAttribute("data-recoverspeed");
						break;
					}
				}
				tracks[id - 1] = new clsSpaceCraft(id, speed, expend, recoverSpeed);
				var div = document.createElement("div");
				div.className = "track-" + id;
				div.innerHTML = '<label>对' + id + '号飞船下达指令：</label><button class="control-button" name="start-button" type="button">开始飞行</button><button class="control-button" name="stop-button" type="button">停止飞行</button><button class="control-button" name="destroy-button" type="button">销毁飞船</button>';
				commandSys.appendChild(div);
				return ;
			case "start-button": command = "start"; break;
			case "stop-button": command = "stop"; break;
			case "destroy-button": command = "destroy"; break;
			default: return;
		}
		target.disabled = true;
		message = JSON.stringify(new clsMessage(id, command));
		singleBus.send(singleBus.adapter(message), tracks, target);
	}
	EventUtil.addHandler(controlDiv, "click", buttonHandler);
})();
