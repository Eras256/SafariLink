'use client';

import { SuperChatBot } from './SuperChatBot';

/**
 * Provider que incluye el SuperChatBot en toda la aplicación
 * Se puede usar en el layout principal o en páginas específicas
 */
export function ChatBotProvider() {
  return <SuperChatBot position="bottom-right" defaultOpen={false} />;
}



