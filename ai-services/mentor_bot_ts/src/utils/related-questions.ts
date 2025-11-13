/**
 * Generación de preguntas relacionadas
 * Migrado desde Python - Misma lógica
 */

const questionsEn = {
  deploy: [
    'How do I verify my contract on Etherscan?',
    'What are the gas costs for deployment?',
    'How do I deploy to testnet first?',
  ],
  test: [
    'What testing framework should I use?',
    'How do I write unit tests for smart contracts?',
    'What is fuzzing and should I use it?',
  ],
  security: [
    'What are common smart contract vulnerabilities?',
    'How do I prevent reentrancy attacks?',
    'Should I get my contract audited?',
  ],
  frontend: [
    'How do I connect MetaMask to my dApp?',
    "What's the difference between Web3.js and Ethers.js?",
    'How do I handle transaction errors in UI?',
  ],
  default: [
    'How do I get started with Solidity?',
    'What tools do I need for Web3 development?',
    'How do I deploy a smart contract?',
  ],
};

const questionsSw = {
  deploy: [
    'Ninawezaje kuthibitisha kandarasi yangu kwenye Etherscan?',
    'Gharama za gesi za kutuma ni nini?',
    'Ninawezaje kutuma kwenye testnet kwanza?',
  ],
  test: [
    'Ni mfumo gani wa kupima ninapaswa kutumia?',
    'Ninaandika vipi vipimo vya kitengo vya kandarasi za akili?',
    'Fuzzing ni nini na ni lazima nilitumie?',
  ],
  security: [
    'Ni hatari gani za kawaida za kandarasi za akili?',
    'Ninawezaje kuzuia mashambulizi ya reentrancy?',
    'Ni lazima nipikie kandarasi yangu?',
  ],
  frontend: [
    'Ninawezaje kuunganisha MetaMask na dApp yangu?',
    'Tofauti kati ya Web3.js na Ethers.js ni nini?',
    'Ninawezaje kushughulikia makosa ya muamala kwenye UI?',
  ],
  default: [
    'Ninawezaje kuanza na Solidity?',
    'Ni zana gani ninazohitaji kwa maendeleo ya Web3?',
    'Ninawezaje kutuma kandarasi ya akili?',
  ],
};

const questionsFr = {
  deploy: [
    'Comment vérifier mon contrat sur Etherscan?',
    'Quels sont les coûts de gaz pour le déploiement?',
    'Comment déployer d\'abord sur testnet?',
  ],
  test: [
    'Quel framework de test devrais-je utiliser?',
    'Comment écrire des tests unitaires pour les contrats intelligents?',
    "Qu'est-ce que le fuzzing et devrais-je l'utiliser?",
  ],
  security: [
    'Quelles sont les vulnérabilités courantes des contrats intelligents?',
    'Comment prévenir les attaques de réentrance?',
    'Devrais-je faire auditer mon contrat?',
  ],
  frontend: [
    'Comment connecter MetaMask à mon dApp?',
    'Quelle est la différence entre Web3.js et Ethers.js?',
    'Comment gérer les erreurs de transaction dans l\'UI?',
  ],
  default: [
    'Comment commencer avec Solidity?',
    'Quels outils ai-je besoin pour le développement Web3?',
    'Comment déployer un contrat intelligent?',
  ],
};

const languageMap: Record<string, typeof questionsEn> = {
  en: questionsEn,
  sw: questionsSw,
  fr: questionsFr,
};

export function generateRelatedQuestions(question: string, language: string = 'en'): string[] {
  const questions = languageMap[language] || questionsEn;
  const keywords = question.toLowerCase();
  const related: string[] = [];

  if (keywords.includes('deploy')) {
    related.push(...questions.deploy);
  } else if (keywords.includes('test')) {
    related.push(...questions.test);
  } else if (keywords.includes('security')) {
    related.push(...questions.security);
  } else if (keywords.includes('frontend')) {
    related.push(...questions.frontend);
  } else {
    related.push(...questions.default);
  }

  return related.slice(0, 3); // Max 3 related questions
}

