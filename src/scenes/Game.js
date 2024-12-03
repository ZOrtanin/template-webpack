import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor (){
        super('Game');

        this.circle = null;
        this.isDragging = false;
        this.startPosition = { x: 0, y: 0 };
        this.dragLine = null; // Линия для визуализации прицеливания
    }

    preload() {
        // Загружаем ресурсы (если понадобятся)
      }

    create() {
        // Создаем физический мир Matter.js
        this.matter.world.setBounds(0, 0, 1024, 768);

        // Создаем круг с физическим телом
        this.circle = this.matter.add.circle(400, 300, 20, {
          restitution: 0.8, // Эластичность
          frictionAir: 0.01, // Сопротивление воздуха
          isStatic: false
        });

        // Линия прицеливания (визуальный эффект)
        this.dragLine = this.add.line(0, 0, 0, 0, 0, 0, 0xffffff).setOrigin(0);

        // События мыши
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointerup', this.onPointerUp, this);
        this.input.on('pointermove', this.onPointerMove, this);
      }

    onPointerDown(pointer) {
        const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.circle.position.x, this.circle.position.y);
        if (dist < 20) {
          this.isDragging = true;
          this.startPosition = { x: pointer.x, y: pointer.y };
        }
    }

    onPointerUp(pointer) {
        if (this.isDragging) {
          this.isDragging = false;
          this.dragLine.setVisible(false); // Скрыть линию прицеливания

          const endPosition = { x: pointer.x, y: pointer.y };
          const forceX = (this.startPosition.x - endPosition.x) * 0.00035; // Масштабируем силу
          const forceY = (this.startPosition.y - endPosition.y) * 0.00035;

          // Применяем импульс к кругу
          this.matter.body.applyForce(this.circle, { x: 0, y: 0 }, { x: forceX, y: forceY });
        }
    }

    onPointerMove(pointer) {
        if (this.isDragging) {
          this.dragLine.setVisible(true); // Показать линию прицеливания
          this.dragLine.setTo(
            this.circle.position.x, this.circle.position.y, // Начало линии
            pointer.x, pointer.y // Текущее положение мыши
          );
        }
    }

    update() {
        // Логика игры
    }


}
