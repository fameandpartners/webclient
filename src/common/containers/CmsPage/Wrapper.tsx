import React from 'react';
import classnames from 'classnames';
const EditIcon = require('@svg/i-edit.svg').default;

interface Props {
  isEditMode: boolean;
  id: string;
  spaceId: string;
  children: React.ReactNode;
}

// todo add status
const Wrapper: React.SFC<Props> = ({ isEditMode, id, spaceId, children }: Props) => {
  return (
    <div className={classnames('wrapper', isEditMode && 'wrapper--edit-mode')} id={id}>
      <style jsx>{`
      @import 'vars';

      .wrapper--edit-mode[data-reactroot] {
        &::before {
          content: 'Editor mode';
          display: block;
          height: 5*$space-base;
          padding-left: 4*$space-base;
          line-height: 40px;
        }
      
        & > .edit-icon {
          top: $space-base;
          left: $space-base/2;
        }
      }
      
        .edit-icon {
          z-index: 99;
          display: block;
          position: absolute;
          padding: 2.5px;
          opacity: 0;
      
          transition: opacity 100ms ease-in-out;
        }
        
        .wrapper--edit-mode:hover {
          outline: 1px dotted grey;
        
          & > .edit-icon {
            fill: black;
            opacity: 1;
          }
        }
      `}</style>
      {isEditMode &&
        <a
          className="edit-icon"
          target="_blank"
          href={`https://app.contentful.com/spaces/${spaceId}/entries/${id}`}
        >
          <EditIcon width={15} height={15}/>
        </a>}
      {children}
    </div>
  );
};

export default Wrapper;