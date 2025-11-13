/**
 * Generación de recursos sugeridos basados en la pregunta
 * Compatible con el servicio mentor_bot
 */

export interface Resource {
  title: string;
  url: string;
  type: string;
}

export interface Context {
  hackathonName?: string;
  chains?: string[];
  techStack?: string[];
}

export function generateResources(question: string, context: Context = {}): Resource[] {
  const resources: Resource[] = [];
  const keywords = question.toLowerCase();

  if (keywords.includes('solidity') || keywords.includes('smart contract')) {
    resources.push({
      title: 'Solidity Documentation',
      url: 'https://docs.soliditylang.org/',
      type: 'documentation',
    });
    resources.push({
      title: 'OpenZeppelin Contracts',
      url: 'https://docs.openzeppelin.com/contracts/',
      type: 'library',
    });
  }

  if (keywords.includes('hardhat')) {
    resources.push({
      title: 'Hardhat Documentation',
      url: 'https://hardhat.org/docs',
      type: 'documentation',
    });
  }

  if (keywords.includes('foundry')) {
    resources.push({
      title: 'Foundry Book',
      url: 'https://book.getfoundry.sh/',
      type: 'documentation',
    });
  }

  if (keywords.includes('wagmi') || keywords.includes('frontend')) {
    resources.push({
      title: 'Wagmi Documentation',
      url: 'https://wagmi.sh/',
      type: 'documentation',
    });
  }

  const contextChains = context.chains || [];
  if (keywords.includes('arbitrum') || contextChains.includes('arbitrum')) {
    resources.push({
      title: 'Arbitrum Developer Docs',
      url: 'https://docs.arbitrum.io/',
      type: 'documentation',
    });
  }

  if (keywords.includes('base') || contextChains.includes('base')) {
    resources.push({
      title: 'Base Documentation',
      url: 'https://docs.base.org/',
      type: 'documentation',
    });
  }

  if (keywords.includes('nft') || keywords.includes('erc721')) {
    resources.push({
      title: 'NFT Tutorial',
      url: 'https://ethereum.org/en/developers/docs/standards/tokens/erc-721/',
      type: 'tutorial',
    });
  }

  return resources.slice(0, 5); // Max 5 resources
}

