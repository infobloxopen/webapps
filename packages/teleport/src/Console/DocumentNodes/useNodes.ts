/*
Copyright 2019 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { useEffect, useState } from 'react';
import { useAttempt } from 'shared/hooks';
import { Node } from 'teleport/services/nodes';
import { useConsoleContext } from './../consoleContextProvider';
import * as stores from './../stores';

export default function useNodes({ clusterId, id }: stores.DocumentNodes) {
  const consoleCtx = useConsoleContext();
  const [searchValue, setSearchValue] = useState('');
  const [attempt, attemptActions] = useAttempt({ isProcessing: true });
  const [state, setState] = useState<{ nodes: Node[]; logins: string[] }>({
    nodes: [],
    logins: [],
  });

  useEffect(() => {
    attemptActions.do(() => {
      return consoleCtx.fetchNodes(clusterId).then(({ nodes, logins }) => {
        setState({
          logins,
          nodes,
        });
      });
    });
  }, [clusterId]);

  function createSshSession(login: string, serverId: string) {
    const url = consoleCtx.getSshDocumentUrl({
      serverId,
      login,
      clusterId,
    });
    consoleCtx.gotoTab({ url });
    consoleCtx.removeDocument(id);
  }

  function changeCluster(value: string) {
    const clusterId = value;
    const url = consoleCtx.getNodeDocumentUrl(clusterId);
    consoleCtx.storeDocs.update(id, {
      url,
      clusterId,
    });

    consoleCtx.gotoTab({ url });
  }

  function getNodeSshLogins(serverId: string) {
    return state.logins.map(login => ({
      login,
      url: consoleCtx.getSshDocumentUrl({ serverId, login, clusterId }),
    }));
  }

  return {
    nodes: state.nodes,
    attempt,
    createSshSession,
    changeCluster,
    getNodeSshLogins,
    searchValue,
    setSearchValue,
  };
}
