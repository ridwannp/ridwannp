import React from 'react';
import { ProcessMapNode } from '../engine/types';
import styles from '../styles/Playground.module.css';

interface ProcessMapProps {
  nodes: ProcessMapNode[];
}

export const ProcessMap: React.FC<ProcessMapProps> = ({ nodes }) => {
  return (
    <div className={styles.processMapContainer} role="region" aria-label="Peta Alur Kerja">
      {nodes.map((node) => (
        <div key={node.id} className={styles.processMapNode}>
          <div className={styles.nodeTitle}>{node.title}</div>
          <div className={styles.nodeSublabel}>{node.sublabel}</div>

          {node.findingNumbers.length > 0 && (
            <div className={styles.nodePills} aria-label={`Temuan nomor ${node.findingNumbers.join(', ')}`}>
              {node.findingNumbers.map((num) => (
                <span
                  key={num}
                  className={styles.nodeFindingPill}
                  title={`Terkait Temuan #${num}`}
                >
                  {num}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

