import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite плагин для разрешения импортов на основе режима сборки (mode)
 * Если mode=ya, то при импорте someFile.ts сначала ищет someFile.ya.ts
 */
export function modeResolverPlugin(): Plugin {
	let currentMode: string = 'development';

	return {
		name: 'vite-plugin-mode-resolver',
		enforce: 'pre', // Выполняем плагин до других плагинов

		configResolved(config) {
			currentMode = config.mode;
			console.log(`[Mode Resolver] Активирован режим: ${currentMode}`);
		},

		resolveId(source: string, importer: string | undefined) {
			// Пропускаем внешние модули и виртуальные модули
			if (!importer || source.startsWith('\0') || !source.startsWith('.')) {
				return null;
			}

			// Пропускаем если режим стандартный
			if (!currentMode || currentMode === 'production' || currentMode === 'development') {
				return null;
			}

			// Получаем абсолютный путь к импортируемому файлу
			const importerDir = path.dirname(importer);
			const resolvedPath = path.resolve(importerDir, source);

			console.log(`[Mode Resolver] Проверяю импорт: ${source} из ${path.basename(importer)}`);

			// Извлекаем расширение и базовое имя файла
			const ext = path.extname(resolvedPath);
			const baseNameWithoutExt = resolvedPath.slice(0, -ext.length);

			// Список возможных расширений для проверки
			const extensionsToCheck = ext ? [ext] : ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

			// Проверяем файлы с mode суффиксом
			for (const extension of extensionsToCheck) {
				const base = ext ? baseNameWithoutExt : resolvedPath;
				const modeSpecificPath = `${base}.${currentMode}${extension}`;

				console.log(`[Mode Resolver]   Ищу: ${modeSpecificPath}`);

				if (fs.existsSync(modeSpecificPath)) {
					console.log(
						`[Mode Resolver] ✓ НАЙДЕН! Использую ${path.basename(modeSpecificPath)}`
					);
					return modeSpecificPath;
				}
			}

			console.log(
				`[Mode Resolver]   Файл с суффиксом .${currentMode} не найден, использую стандартный`
			);
			// Если файл с mode суффиксом не найден, используем стандартный путь
			return null;
		},
	};
}
