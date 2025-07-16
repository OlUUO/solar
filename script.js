class SolarSystem {
    constructor() {
        this.canvas = document.getElementById('solarCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = true;
        this.speed = 1;
        
        // 확대/축소 관련 변수 추가
        this.zoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 3;
        this.zoomStep = 0.1;
        
        // 카메라 이동 관련 변수
        this.cameraX = 0;
        this.cameraY = 0;
        this.targetCameraX = 0;
        this.targetCameraY = 0;
        this.cameraSpeed = 0.1;
        
        // 마우스 드래그 관련 변수
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.dragStartX = 0;
        this.dragStartY = 0;
        
        // 날짜 관련 변수
        const today = new Date();
        today.setHours(0,0,0,0);
        this.currentDate = new Date(today);
        this.referenceDate = new Date(today);
        
        this.setupCanvas();
        this.setupPlanets();
        this.setupControls();
        this.setupEventListeners();
        
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.canvas.style.cursor = 'grab';
    }
    
    setupPlanets() {
        // 태양
        this.sun = {
            name: '태양',
            x: this.centerX,
            y: this.centerY,
            radius: 20,
            color: '#ffd700',
            type: 'star',
            info: {
                '분류': '항성',
                '지름': '1,392,700 km',
                '질량': '1.989 × 10³⁰ kg',
                '표면온도': '5,778 K',
                '나이': '약 46억년'
            }
        };
        
        // 행성 데이터
        this.planets = [
            {
                name: '수성',
                distance: 80,
                period: 88,
                radius: 4,
                color: '#8c8c8c',
                angle: 0,
                speed: 0.02,
                info: {
                    '분류': '암석행성',
                    '지름': '4,879 km',
                    '질량': '3.285 × 10²³ kg',
                    '공전주기': '88일',
                    '표면온도': '-180°C ~ 430°C'
                }
            },
            {
                name: '금성',
                distance: 120,
                period: 225,
                radius: 6,
                color: '#ffa500',
                angle: 45,
                speed: 0.015,
                info: {
                    '분류': '암석행성',
                    '지름': '12,104 km',
                    '질량': '4.867 × 10²⁴ kg',
                    '공전주기': '225일',
                    '표면온도': '462°C'
                }
            },
            {
                name: '지구',
                distance: 160,
                period: 365.25,
                radius: 7,
                color: '#4169e1',
                angle: 90,
                speed: 0.012,
                info: {
                    '분류': '암석행성',
                    '지름': '12,742 km',
                    '질량': '5.972 × 10²⁴ kg',
                    '공전주기': '365.25일',
                    '위성': '달',
                    '표면온도': '-88°C ~ 58°C'
                }
            },
            {
                name: '화성',
                distance: 200,
                period: 687,
                radius: 5,
                color: '#dc143c',
                angle: 135,
                speed: 0.008,
                info: {
                    '분류': '암석행성',
                    '지름': '6,780 km',
                    '질량': '6.39 × 10²³ kg',
                    '공전주기': '687일',
                    '위성': '포보스, 데이모스',
                    '표면온도': '-140°C ~ 20°C'
                }
            },
            {
                name: '목성',
                distance: 280,
                period: 4333,
                radius: 12,
                color: '#daa520',
                angle: 180,
                speed: 0.005,
                info: {
                    '분류': '가스행성',
                    '지름': '139,820 km',
                    '질량': '1.898 × 10²⁷ kg',
                    '공전주기': '11.86년',
                    '위성': '79개 (이오, 유로파 등)',
                    '대적점': '지구보다 큰 폭풍'
                }
            },
            {
                name: '토성',
                distance: 340,
                period: 10759,
                radius: 10,
                color: '#f4a460',
                angle: 225,
                speed: 0.004,
                info: {
                    '분류': '가스행성',
                    '지름': '116,460 km',
                    '질량': '5.683 × 10²⁶ kg',
                    '공전주기': '29.46년',
                    '위성': '82개 (타이탄 등)',
                    '고리': '얼음과 바위로 구성'
                }
            },
            {
                name: '천왕성',
                distance: 400,
                period: 30687,
                radius: 8,
                color: '#87ceeb',
                angle: 270,
                speed: 0.003,
                info: {
                    '분류': '얼음행성',
                    '지름': '50,724 km',
                    '질량': '8.681 × 10²⁵ kg',
                    '공전주기': '84.02년',
                    '위성': '27개',
                    '특징': '축이 98도 기울어짐'
                }
            },
            {
                name: '해왕성',
                distance: 460,
                period: 60190,
                radius: 8,
                color: '#000080',
                angle: 315,
                speed: 0.002,
                info: {
                    '분류': '얼음행성',
                    '지름': '49,244 km',
                    '질량': '1.024 × 10²⁶ kg',
                    '공전주기': '164.79년',
                    '위성': '14개',
                    '특징': '가장 빠른 바람 (2,100 km/h)'
                }
            },
            {
                name: '명왕성',
                distance: 520,
                period: 90560,
                radius: 3,
                color: '#f5f5f5',
                angle: 0,
                speed: 0.001,
                info: {
                    '분류': '왜행성',
                    '지름': '2,377 km',
                    '질량': '1.309 × 10²² kg',
                    '공전주기': '248.09년',
                    '위성': '5개 (카론 등)',
                    '특징': '2006년 왜행성으로 재분류'
                }
            }
        ];
        
        // 혜성 데이터
        this.comets = [
            {
                name: '핼리혜성',
                semiMajorAxis: 800,
                eccentricity: 0.967,
                period: 75.32,
                radius: 2,
                color: '#ffffff',
                angle: 0,
                speed: 0.003,
                tailLength: 50,
                info: {
                    '분류': '혜성',
                    '지름': '11 km',
                    '질량': '2.2 × 10¹⁴ kg',
                    '공전주기': '75.32년',
                    '근일점': '0.586 AU',
                    '원일점': '35.082 AU',
                    '특징': '가장 유명한 혜성, 2061년에 다시 관측 예정'
                }
            },
            {
                name: '혜성 67P',
                semiMajorAxis: 600,
                eccentricity: 0.64,
                period: 6.44,
                radius: 1.5,
                color: '#e6e6fa',
                angle: 45,
                speed: 0.008,
                tailLength: 30,
                info: {
                    '분류': '혜성',
                    '지름': '4.1 km',
                    '질량': '9.98 × 10¹² kg',
                    '공전주기': '6.44년',
                    '근일점': '1.24 AU',
                    '원일점': '5.68 AU',
                    '특징': '로제타 탐사선이 착륙한 혜성'
                }
            }
        ];
        
        // 확장된 위성 데이터
        this.moons = [
            {
                name: '달',
                planet: '지구',
                distance: 25,
                radius: 2,
                color: '#c0c0c0',
                angle: 0,
                speed: 0.02,
                info: {
                    '분류': '위성',
                    '지름': '3,474 km',
                    '질량': '7.342 × 10²² kg',
                    '공전주기': '27.3일',
                    '특징': '지구의 유일한 자연위성'
                }
            },
            {
                name: '포보스',
                planet: '화성',
                distance: 15,
                radius: 1,
                color: '#a0522d',
                angle: 30,
                speed: 0.025,
                info: {
                    '분류': '위성',
                    '지름': '22.2 km',
                    '질량': '1.0659 × 10¹⁶ kg',
                    '공전주기': '7.66시간',
                    '특징': '화성의 가장 큰 위성'
                }
            },
            {
                name: '데이모스',
                planet: '화성',
                distance: 20,
                radius: 1,
                color: '#8b4513',
                angle: 60,
                speed: 0.018,
                info: {
                    '분류': '위성',
                    '지름': '12.4 km',
                    '질량': '1.4762 × 10¹⁵ kg',
                    '공전주기': '30.35시간',
                    '특징': '화성의 두 번째 위성'
                }
            },
            {
                name: '이오',
                planet: '목성',
                distance: 35,
                radius: 3,
                color: '#ffd700',
                angle: 0,
                speed: 0.03,
                info: {
                    '분류': '위성',
                    '지름': '3,642 km',
                    '질량': '8.932 × 10²² kg',
                    '공전주기': '1.77일',
                    '특징': '가장 화산 활동이 활발한 위성'
                }
            },
            {
                name: '유로파',
                planet: '목성',
                distance: 45,
                radius: 2.5,
                color: '#f0f8ff',
                angle: 45,
                speed: 0.025,
                info: {
                    '분류': '위성',
                    '지름': '3,122 km',
                    '질량': '4.8 × 10²² kg',
                    '공전주기': '3.55일',
                    '특징': '얼음 표면 아래 바다가 있을 것으로 추정'
                }
            },
            {
                name: '가니메데',
                planet: '목성',
                distance: 55,
                radius: 3.5,
                color: '#d3d3d3',
                angle: 90,
                speed: 0.02,
                info: {
                    '분류': '위성',
                    '지름': '5,268 km',
                    '질량': '1.482 × 10²³ kg',
                    '공전주기': '7.15일',
                    '특징': '태양계에서 가장 큰 위성'
                }
            },
            {
                name: '칼리스토',
                planet: '목성',
                distance: 65,
                radius: 3,
                color: '#696969',
                angle: 135,
                speed: 0.015,
                info: {
                    '분류': '위성',
                    '지름': '4,821 km',
                    '질량': '1.076 × 10²³ kg',
                    '공전주기': '16.69일',
                    '특징': '가장 많은 충돌구를 가진 위성'
                }
            },
            {
                name: '타이탄',
                planet: '토성',
                distance: 40,
                radius: 4,
                color: '#ffa500',
                angle: 0,
                speed: 0.015,
                info: {
                    '분류': '위성',
                    '지름': '5,151 km',
                    '질량': '1.3452 × 10²³ kg',
                    '공전주기': '15.95일',
                    '특징': '두꺼운 대기를 가진 위성'
                }
            },
            {
                name: '엔셀라두스',
                planet: '토성',
                distance: 30,
                radius: 2,
                color: '#ffffff',
                angle: 60,
                speed: 0.02,
                info: {
                    '분류': '위성',
                    '지름': '504 km',
                    '질량': '1.08 × 10²⁰ kg',
                    '공전주기': '1.37일',
                    '특징': '얼음 분수로 유명한 위성'
                }
            },
            {
                name: '미란다',
                planet: '천왕성',
                distance: 25,
                radius: 1.5,
                color: '#e6e6fa',
                angle: 0,
                speed: 0.025,
                info: {
                    '분류': '위성',
                    '지름': '472 km',
                    '질량': '6.59 × 10¹⁹ kg',
                    '공전주기': '1.41일',
                    '특징': '가장 기이한 표면을 가진 위성'
                }
            },
            {
                name: '트리톤',
                planet: '해왕성',
                distance: 35,
                radius: 2.5,
                color: '#f0f8ff',
                angle: 45,
                speed: 0.018,
                info: {
                    '분류': '위성',
                    '지름': '2,707 km',
                    '질량': '2.14 × 10²² kg',
                    '공전주기': '5.88일',
                    '특징': '역행 궤도를 도는 위성'
                }
            },
            {
                name: '카론',
                planet: '명왕성',
                distance: 15,
                radius: 1.5,
                color: '#d3d3d3',
                angle: 0,
                speed: 0.02,
                info: {
                    '분류': '위성',
                    '지름': '1,212 km',
                    '질량': '1.586 × 10²¹ kg',
                    '공전주기': '6.39일',
                    '특징': '명왕성의 가장 큰 위성'
                }
            }
        ];
    }
    
    setupControls() {
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.planetInfo = document.getElementById('planetInfo');
        this.dateInput = document.getElementById('dateInput');
        this.goToDateBtn = document.getElementById('goToDateBtn');
        // 오늘 날짜로 초기화
        const todayStr = this.referenceDate.toISOString().split('T')[0];
        this.dateInput.value = todayStr;
    }
    
    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedSlider.addEventListener('input', (e) => this.changeSpeed(e.target.value));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // 마우스 휠 이벤트 추가
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        
        // 터치 이벤트 (모바일 지원)
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        
        // 범례 클릭 이벤트 추가
        document.querySelectorAll('.legend-item.clickable').forEach(item => {
            item.addEventListener('click', (e) => this.handleLegendClick(e));
        });
        
        // 마우스 드래그 이벤트 추가
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // 터치 드래그 이벤트 추가 (모바일)
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // 날짜 이벤트 추가
        this.goToDateBtn.addEventListener('click', () => this.goToDate());
        this.dateInput.addEventListener('change', () => this.goToDate());
        
        // 날짜 이벤트 추가
        this.goToDateBtn.addEventListener('click', () => this.goToDate());
        this.dateInput.addEventListener('change', () => this.goToDate());
    }
    
    handleWheel(event) {
        event.preventDefault();
        
        const delta = event.deltaY > 0 ? -1 : 1;
        const newZoom = this.zoom + (delta * this.zoomStep);
        
        if (newZoom >= this.minZoom && newZoom <= this.maxZoom) {
            this.zoom = newZoom;
        }
    }
    
    handleMouseDown(event) {
        event.preventDefault();
        this.isDragging = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.canvas.style.cursor = 'grabbing';
    }
    
    handleMouseMove(event) {
        if (!this.isDragging) return;
        
        event.preventDefault();
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;
        
        // 드래그 거리가 충분히 클 때만 카메라 이동
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
            this.targetCameraX += deltaX / this.zoom;
            this.targetCameraY += deltaY / this.zoom;
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
        }
    }
    
    handleMouseUp(event) {
        if (this.isDragging) {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
            
            // 클릭 이벤트와 드래그 이벤트 구분
            const dragDistance = Math.sqrt(
                (event.clientX - this.dragStartX) ** 2 + 
                (event.clientY - this.dragStartY) ** 2
            );
            
            if (dragDistance < 5) {
                // 드래그가 아닌 클릭으로 간주
                this.handleClick(event);
            }
        }
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            // 단일 터치 - 드래그 모드
            this.isDragging = true;
            this.lastMouseX = event.touches[0].clientX;
            this.lastMouseY = event.touches[0].clientY;
            this.dragStartX = event.touches[0].clientX;
            this.dragStartY = event.touches[0].clientY;
        } else if (event.touches.length === 2) {
            // 이중 터치 - 확대/축소 모드
            this.touchStartY = event.touches[0].clientY;
        }
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        
        if (event.touches.length === 1 && this.isDragging) {
            // 단일 터치 드래그
            const deltaX = event.touches[0].clientX - this.lastMouseX;
            const deltaY = event.touches[0].clientY - this.lastMouseY;
            
            if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
                this.targetCameraX += deltaX / this.zoom;
                this.targetCameraY += deltaY / this.zoom;
                this.lastMouseX = event.touches[0].clientX;
                this.lastMouseY = event.touches[0].clientY;
            }
        } else if (event.touches.length === 2 && this.touchStartY) {
            // 이중 터치 확대/축소
            const touchY = event.touches[0].clientY;
            const delta = this.touchStartY - touchY;
            
            if (Math.abs(delta) > 10) {
                const zoomDelta = delta > 0 ? 1 : -1;
                const newZoom = this.zoom + (zoomDelta * this.zoomStep);
                
                if (newZoom >= this.minZoom && newZoom <= this.maxZoom) {
                    this.zoom = newZoom;
                }
                
                this.touchStartY = touchY;
            }
        }
    }
    
    handleTouchEnd(event) {
        if (this.isDragging) {
            this.isDragging = false;
            
            // 터치 클릭 이벤트 처리
            if (event.changedTouches.length > 0) {
                const touch = event.changedTouches[0];
                const dragDistance = Math.sqrt(
                    (touch.clientX - this.dragStartX) ** 2 + 
                    (touch.clientY - this.dragStartY) ** 2
                );
                
                if (dragDistance < 10) {
                    // 드래그가 아닌 클릭으로 간주
                    const clickEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        preventDefault: () => {}
                    };
                    this.handleClick(clickEvent);
                }
            }
        }
        
        this.touchStartY = null;
    }
    
    togglePlayPause() {
        this.isRunning = !this.isRunning;
        this.playPauseBtn.textContent = this.isRunning ? '일시정지' : '재생';
    }
    
    reset() {
        this.planets.forEach(planet => {
            planet.angle = Math.random() * 360;
        });
        this.moons.forEach(moon => {
            moon.angle = Math.random() * 360;
        });
        this.comets.forEach(comet => {
            comet.angle = Math.random() * 360;
        });
        this.zoom = 1; // 확대/축소도 리셋
        this.cameraX = 0; // 카메라 위치도 리셋
        this.cameraY = 0;
        this.targetCameraX = 0;
        this.targetCameraY = 0;
        this.isDragging = false; // 드래그 상태도 리셋
        this.canvas.style.cursor = 'grab';
    }
    
    changeSpeed(value) {
        this.speed = parseFloat(value);
        this.speedValue.textContent = value + 'x';
    }
    
    goToDate() {
        const dateString = this.dateInput.value;
        if (!dateString) return;
        
        this.currentDate = new Date(dateString);
        this.calculatePlanetPositions();
        this.updateDateDisplay();
    }
    
    calculatePlanetPositions() {
        const daysDiff = (this.currentDate - this.referenceDate) / (1000 * 60 * 60 * 24);
        
        // 행성 위치 계산
        this.planets.forEach(planet => {
            const daysPerYear = planet.period;
            const revolutions = daysDiff / daysPerYear;
            planet.angle = (revolutions * 360) % 360;
            if (planet.angle < 0) planet.angle += 360;
        });
        
        // 위성 위치 계산
        this.moons.forEach(moon => {
            const planet = this.planets.find(p => p.name === moon.planet);
            if (planet) {
                const planetDaysPerYear = planet.period;
                const moonSpeedRatio = moon.speed / planet.speed;
                const moonRevolutions = (daysDiff / planetDaysPerYear) * moonSpeedRatio;
                moon.angle = (moonRevolutions * 360) % 360;
                if (moon.angle < 0) moon.angle += 360;
            }
        });
        
        // 혜성 위치 계산
        this.comets.forEach(comet => {
            const daysPerYear = comet.period * 365.25;
            const revolutions = daysDiff / daysPerYear;
            comet.angle = (revolutions * 360) % 360;
            if (comet.angle < 0) comet.angle += 360;
        });
    }
    
    updateDateDisplay() {
        const dateString = this.currentDate.toISOString().split('T')[0];
        this.dateInput.value = dateString;
        
        // 날짜 정보를 화면에 표시
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        const formattedDate = this.currentDate.toLocaleDateString('ko-KR', options);
        
        // 날짜 정보를 정보 패널에 표시
        const dateInfo = `
            <div class="planet-detail">
                <h4>📅 현재 날짜</h4>
                <p><strong>날짜:</strong> ${formattedDate}</p>
                <p><strong>기준일:</strong> 2024년 1월 1일</p>
                <p><em>행성들의 실제 위치가 계산되었습니다.</em></p>
            </div>
        `;
        
        // 기존 정보가 없으면 날짜 정보 표시
        if (this.planetInfo.innerHTML.includes('행성을 클릭하면')) {
            this.planetInfo.innerHTML = dateInfo;
        }
    }
    
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / this.zoom;
        const y = (event.clientY - rect.top) / this.zoom;
        
        // 태양 클릭 확인
        const sunDistance = Math.sqrt((x - this.sun.x) ** 2 + (y - this.sun.y) ** 2);
        if (sunDistance <= this.sun.radius) {
            this.showPlanetInfo(this.sun);
            return;
        }
        
        // 행성 클릭 확인
        for (let planet of this.planets) {
            const planetX = this.centerX + Math.cos(planet.angle * Math.PI / 180) * planet.distance;
            const planetY = this.centerY + Math.sin(planet.angle * Math.PI / 180) * planet.distance;
            const distance = Math.sqrt((x - planetX) ** 2 + (y - planetY) ** 2);
            
            if (distance <= planet.radius) {
                this.showPlanetInfo(planet);
                return;
            }
        }
        
        // 위성 클릭 확인
        for (let moon of this.moons) {
            const planet = this.planets.find(p => p.name === moon.planet);
            if (planet) {
                const planetX = this.centerX + Math.cos(planet.angle * Math.PI / 180) * planet.distance;
                const planetY = this.centerY + Math.sin(planet.angle * Math.PI / 180) * planet.distance;
                const moonX = planetX + Math.cos(moon.angle * Math.PI / 180) * moon.distance;
                const moonY = planetY + Math.sin(moon.angle * Math.PI / 180) * moon.distance;
                const distance = Math.sqrt((x - moonX) ** 2 + (y - moonY) ** 2);
                
                if (distance <= moon.radius) {
                    this.showPlanetInfo(moon);
                    return;
                }
            }
        }
        
        // 혜성 클릭 확인
        for (let comet of this.comets) {
            const position = this.calculateCometPosition(comet);
            const cometX = this.centerX + position.x;
            const cometY = this.centerY + position.y;
            const distance = Math.sqrt((x - cometX) ** 2 + (y - cometY) ** 2);
            
            if (distance <= comet.radius) {
                this.showPlanetInfo(comet);
                return;
            }
        }
    }
    
    handleLegendClick(event) {
        const target = event.currentTarget.getAttribute('data-target');
        this.focusOnCelestial(target);
    }
    
    focusOnCelestial(name) {
        let targetX = 0;
        let targetY = 0;
        let targetZoom = 1;
        
        if (name === 'sun') {
            targetX = 0;
            targetY = 0;
            targetZoom = 1.5;
        } else {
            // 행성 찾기
            const planet = this.planets.find(p => p.name === name);
            if (planet) {
                const planetX = Math.cos(planet.angle * Math.PI / 180) * planet.distance;
                const planetY = Math.sin(planet.angle * Math.PI / 180) * planet.distance;
                targetX = -planetX;
                targetY = -planetY;
                targetZoom = 2;
            } else {
                // 위성 찾기
                const moon = this.moons.find(m => m.name === name);
                if (moon) {
                    const planet = this.planets.find(p => p.name === moon.planet);
                    if (planet) {
                        const planetX = Math.cos(planet.angle * Math.PI / 180) * planet.distance;
                        const planetY = Math.sin(planet.angle * Math.PI / 180) * planet.distance;
                        const moonX = planetX + Math.cos(moon.angle * Math.PI / 180) * moon.distance;
                        const moonY = planetY + Math.sin(moon.angle * Math.PI / 180) * moon.distance;
                        targetX = -moonX;
                        targetY = -moonY;
                        targetZoom = 2.5;
                    }
                } else {
                    // 혜성 찾기
                    const comet = this.comets.find(c => c.name === name);
                    if (comet) {
                        const position = this.calculateCometPosition(comet);
                        targetX = -position.x;
                        targetY = -position.y;
                        targetZoom = 2;
                    }
                }
            }
        }
        
        // 부드러운 카메라 이동
        this.targetCameraX = targetX;
        this.targetCameraY = targetY;
        
        // 부드러운 확대/축소
        const zoomDiff = targetZoom - this.zoom;
        if (Math.abs(zoomDiff) > 0.1) {
            this.zoom += zoomDiff * 0.05;
        }
        
        // 정보 표시
        if (name === 'sun') {
            this.showPlanetInfo(this.sun);
        } else {
            const planet = this.planets.find(p => p.name === name);
            if (planet) {
                this.showPlanetInfo(planet);
            } else {
                const moon = this.moons.find(m => m.name === name);
                if (moon) {
                    this.showPlanetInfo(moon);
                } else {
                    const comet = this.comets.find(c => c.name === name);
                    if (comet) {
                        this.showPlanetInfo(comet);
                    }
                }
            }
        }
    }
    
    showPlanetInfo(celestial) {
        let html = `<div class="planet-detail">`;
        html += `<h4>${celestial.name}</h4>`;
        
        for (let [key, value] of Object.entries(celestial.info)) {
            html += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        
        html += `</div>`;
        this.planetInfo.innerHTML = html;
    }
    
    drawOrbit(ctx, distance) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, distance, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    drawCelestial(ctx, x, y, radius, color, name = '') {
        // 확대/축소 적용
        const scaledRadius = radius * this.zoom;
        
        // 그림자 효과
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5 * this.zoom;
        ctx.shadowOffsetX = 2 * this.zoom;
        ctx.shadowOffsetY = 2 * this.zoom;
        
        // 그라데이션 효과
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, scaledRadius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 0.3));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, scaledRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // 그림자 효과 초기화
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // 이름 표시 (확대 시에만)
        if (name && scaledRadius > 5 && this.zoom > 0.8) {
            ctx.fillStyle = 'white';
            ctx.font = `${12 * this.zoom}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(name, x, y + scaledRadius + 15 * this.zoom);
        }
    }
    
    drawComet(ctx, comet) {
        const position = this.calculateCometPosition(comet);
        const x = this.centerX + position.x;
        const y = this.centerY + position.y;
        const scaledRadius = comet.radius * this.zoom;
        
        // 혜성 핵 그리기
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, scaledRadius);
        gradient.addColorStop(0, comet.color);
        gradient.addColorStop(1, this.darkenColor(comet.color, 0.5));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, scaledRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // 혜성 꼬리 그리기 (태양에서 멀어질 때만)
        const distanceFromSun = Math.sqrt(position.x * position.x + position.y * position.y);
        if (distanceFromSun > 100) {
            this.drawCometTail(ctx, x, y, position.x, position.y, comet);
        }
        
        // 이름 표시
        if (this.zoom > 0.8) {
            ctx.fillStyle = 'white';
            ctx.font = `${10 * this.zoom}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(comet.name, x, y + scaledRadius + 12 * this.zoom);
        }
    }
    
    drawCometTail(ctx, x, y, dx, dy, comet) {
        const tailLength = comet.tailLength * this.zoom;
        const tailWidth = 2 * this.zoom;
        
        // 태양 방향으로 꼬리 그리기
        const angle = Math.atan2(dy, dx);
        const tailStartX = x;
        const tailStartY = y;
        const tailEndX = x - Math.cos(angle) * tailLength;
        const tailEndY = y - Math.sin(angle) * tailLength;
        
        // 꼬리 그라데이션
        const tailGradient = ctx.createLinearGradient(tailStartX, tailStartY, tailEndX, tailEndY);
        tailGradient.addColorStop(0, comet.color);
        tailGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        tailGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        ctx.strokeStyle = tailGradient;
        ctx.lineWidth = tailWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailStartX, tailStartY);
        ctx.lineTo(tailEndX, tailEndY);
        ctx.stroke();
        
        // 꼬리 효과 (여러 선)
        for (let i = 1; i <= 3; i++) {
            const offset = i * 0.5;
            const offsetX = x - Math.cos(angle + offset) * tailLength * 0.8;
            const offsetY = y - Math.sin(angle + offset) * tailLength * 0.8;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - i * 0.1})`;
            ctx.lineWidth = tailWidth * 0.5;
            ctx.beginPath();
            ctx.moveTo(tailStartX, tailStartY);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
    }
    
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    
    // 혜성의 타원 궤도 위치 계산
    calculateCometPosition(comet) {
        const angle = comet.angle * Math.PI / 180;
        const a = comet.semiMajorAxis;
        const e = comet.eccentricity;
        
        // 타원 궤도 공식
        const r = a * (1 - e * e) / (1 + e * Math.cos(angle));
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        return { x, y, r };
    }
    
    update() {
        if (!this.isRunning) return;
        
        // 행성 업데이트
        this.planets.forEach(planet => {
            planet.angle += planet.speed * this.speed;
            if (planet.angle >= 360) planet.angle -= 360;
        });
        
        // 위성 업데이트
        this.moons.forEach(moon => {
            moon.angle += moon.speed * this.speed;
            if (moon.angle >= 360) moon.angle -= 360;
        });
        
        // 혜성 업데이트
        this.comets.forEach(comet => {
            comet.angle += comet.speed * this.speed;
            if (comet.angle >= 360) comet.angle -= 360;
        });
        
        // 카메라 부드러운 이동
        const cameraDiffX = this.targetCameraX - this.cameraX;
        const cameraDiffY = this.targetCameraY - this.cameraY;
        
        if (Math.abs(cameraDiffX) > 0.1) {
            this.cameraX += cameraDiffX * this.cameraSpeed;
        }
        if (Math.abs(cameraDiffY) > 0.1) {
            this.cameraY += cameraDiffY * this.cameraSpeed;
        }
    }
    
    draw() {
        // 캔버스 클리어
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 확대/축소 및 카메라 이동 변환 적용
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(this.cameraX, this.cameraY);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        
        // 배경 별들
        this.drawStars();
        
        // 궤도 그리기
        this.planets.forEach(planet => {
            this.drawOrbit(this.ctx, planet.distance);
        });
        
        // 태양 그리기
        this.drawCelestial(this.ctx, this.sun.x, this.sun.y, this.sun.radius, this.sun.color, '태양');
        
        // 행성 그리기
        this.planets.forEach(planet => {
            const x = this.centerX + Math.cos(planet.angle * Math.PI / 180) * planet.distance;
            const y = this.centerY + Math.sin(planet.angle * Math.PI / 180) * planet.distance;
            this.drawCelestial(this.ctx, x, y, planet.radius, planet.color, planet.name);
        });
        
        // 위성 그리기
        this.moons.forEach(moon => {
            const planet = this.planets.find(p => p.name === moon.planet);
            if (planet) {
                const planetX = this.centerX + Math.cos(planet.angle * Math.PI / 180) * planet.distance;
                const planetY = this.centerY + Math.sin(planet.angle * Math.PI / 180) * planet.distance;
                const moonX = planetX + Math.cos(moon.angle * Math.PI / 180) * moon.distance;
                const moonY = planetY + Math.sin(moon.angle * Math.PI / 180) * moon.distance;
                this.drawCelestial(this.ctx, moonX, moonY, moon.radius, moon.color, moon.name);
            }
        });
        
        // 혜성 그리기
        this.comets.forEach(comet => {
            this.drawComet(this.ctx, comet);
        });
        
        // 변환 복원
        this.ctx.restore();
        
        // 확대/축소 정보 표시
        this.drawZoomInfo();
    }
    
    drawZoomInfo() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`확대: ${(this.zoom * 100).toFixed(0)}%`, 10, 25);
        this.ctx.fillText('마우스 휠로 확대/축소', 10, 45);
        this.ctx.fillText('드래그로 태양계 이동', 10, 65);
        
        // 카메라 이동 중일 때 표시
        if (Math.abs(this.targetCameraX - this.cameraX) > 0.1 || Math.abs(this.targetCameraY - this.cameraY) > 0.1) {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            this.ctx.fillText('카메라 이동 중...', 10, 85);
        }
        
        // 드래그 중일 때 표시
        if (this.isDragging) {
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            this.ctx.fillText('드래그 중...', 10, 105);
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// 페이지 로드 시 태양계 시작
document.addEventListener('DOMContentLoaded', () => {
    new SolarSystem();
}); 