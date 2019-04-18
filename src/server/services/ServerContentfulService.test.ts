import ServerContentfulService from './ServerContentfulService';
import { Entry, EntryCollection } from 'contentful';
import { DeepPartial } from '@typings';
import { logHandledError } from '@common/utils/error-reporting';
import { SiteVersion } from '@common/constants';
import NodeCache from 'node-cache';

jest.mock('@common/utils/error-reporting', () => ({ logHandledError: jest.fn() }));

function mockService() {
  const service = new ServerContentfulService(new NodeCache());
  service.publishedClient = { getEntries: jest.fn(), getAsset: jest.fn() } as any;

  return service;
}

describe('getEntryByField', () => {
  it('calls contentful api', () => {
    const service = mockService();
    service.getEntryByField<any, any>('url', '/testurl', 'page', false, null, SiteVersion.AU);

    expect(service.publishedClient.getEntries).toHaveBeenCalledWith({
      'content_type': 'page',
      'fields.url': '/testurl',
      'locale': 'en-AU',
      'include': 10
    });
  });
});

describe('getEntryById', () => {
  it('calls contentful api', () => {
    const service = mockService();
    service.getEntryById('id123', false, null, SiteVersion.AU);

    expect(service.publishedClient.getEntries).toHaveBeenCalledWith({
      'include': 10,
      'sys.id': 'id123',
      'locale': 'en-AU',
    });
  });
});

describe('_mapContentfulElementToObject', () => {
  it('maps simple response', () => {
    const service = mockService();

    const input: DeepPartial<EntryCollection<any>> = {
      items: [
        {
          sys: {
            id: 'root id',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'root type'
              }
            },
            space: {
              sys: {
                id: 'space id'
              }
            }
          },
          fields: {
            fieldA: 'value a',
            fieldB: ['value b', 'value c']
          }
        }
      ],
      includes: {}
    };

    const expected = {
      fieldA: 'value a',
      fieldB: ['value b', 'value c'],
      id: 'root id',
      cmsType: 'element',
      spaceId: 'space id',
      type: 'root type'
    };

    expect(service._mapContentfulElementToObject(input as EntryCollection<any>, input.items!![0])).toEqual(expected);
  });

  it('resolves inline fields', () => {
    const service = mockService();

    const input: DeepPartial<EntryCollection<any>> = {
      items: [
        {
          sys: {
            id: 'root id',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'root type'
              }
            },
            space: {
              sys: {
                id: 'space id'
              }
            }
          },
          fields: {
            fieldA: [
              {
                sys: {
                  id: 'field a id',
                  type: 'Entry',
                  contentType: {
                    sys: {
                      id: 'field a type'
                    }
                  },
                  space: {
                    sys: {
                      id: 'field a space id'
                    }
                  }
                },
                fields: {
                  subfieldA: 'subvalue a'
                }
              }
            ],
            fieldB: {
              sys: {
                id: 'field b id',
                type: 'Entry',
                contentType: {
                  sys: {
                    id: 'field b type'
                  }
                },
                space: {
                  sys: {
                    id: 'field b space id'
                  }
                }
              },
              fields: {
                subfieldB: 'subvalue b'
              }
            }
          }
        }
      ],
      includes: {}
    };

    const expected = {
      fieldA: [
        {
          id: 'field a id',
          cmsType: 'element',
          spaceId: 'field a space id',
          subfieldA: 'subvalue a',
          type: 'field a type'
        }
      ],
      fieldB: {
        id: 'field b id',
        cmsType: 'element',
        spaceId: 'field b space id',
        subfieldB: 'subvalue b',
        type: 'field b type'
      },
      id: 'root id',
      cmsType: 'element',
      spaceId: 'space id',
      type: 'root type'
    };

    expect(service._mapContentfulElementToObject(input as EntryCollection<any>, input.items!![0])).toEqual(expected);
  });

  it('resolves included fields', () => {
    const service = mockService();

    const input: any = {
      items: [
        {
          sys: {
            id: 'root id',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'root type'
              }
            },
            space: {
              sys: {
                id: 'space id'
              }
            }
          },
          fields: {
            fieldA: [
              {
                sys: {
                  id: 'field a id',
                  linkType: 'entry',
                  contentType: {
                    sys: {
                      id: 'field a type'
                    }
                  },
                  space: {
                    sys: {
                      id: 'field a space id'
                    }
                  }
                }
              }
            ]
          }
        }
      ],
      includes: {
        entry: [
          {
            sys: {
              id: 'field a id',
              type: 'Entry',
              contentType: {
                sys: {
                  id: 'field a type'
                }
              },
              space: {
                sys: {
                  id: 'field a space id'
                }
              }
            },
            fields: {
              subfieldA: 'subvalue a'
            }
          }
        ]
      }
    };

    const expected = {
      fieldA: [
        {
          id: 'field a id',
          cmsType: 'element',
          spaceId: 'field a space id',
          subfieldA: 'subvalue a',
          type: 'field a type'
        }
      ],
      id: 'root id',
      cmsType: 'element',
      spaceId: 'space id',
      type: 'root type'
    };

    expect(service._mapContentfulElementToObject(input as EntryCollection<any>, input.items!![0])).toEqual(expected);
  });

  it('resolves included asset - without data', () => {
    const service = mockService();

    const input: DeepPartial<EntryCollection<any>> = {
      items: [
        {
          sys: {
            id: 'root id',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'root type'
              }
            },
            space: {
              sys: {
                id: 'space id'
              }
            }
          },
          fields: {
            fieldA: [
              {
                sys: {
                  id: 'field a id',
                  type: 'Asset',
                  space: {
                    sys: {
                      id: 'field a space id'
                    }
                  }
                },
                fields: {}
              }
            ]
          }
        }
      ],
      includes: {}
    };

    const expected = {
      fieldA: [
        {
          id: 'field a id',
          cmsType: 'asset',
          spaceId: 'field a space id',
          description: '',
          title: undefined,
          url: undefined
        }
      ],
      id: 'root id',
      cmsType: 'element',
      spaceId: 'space id',
      type: 'root type'
    };

    expect(service._mapContentfulElementToObject(input as EntryCollection<any>, input.items!![0])).toEqual(expected);
  });

  it('resolves included asset - with data', () => {
    const service = mockService();

    const input: DeepPartial<EntryCollection<any>> = {
      items: [
        {
          sys: {
            id: 'root id',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'root type'
              }
            },
            space: {
              sys: {
                id: 'space id'
              }
            }
          },
          fields: {
            fieldA: [
              {
                sys: {
                  id: 'field a id',
                  type: 'Asset',
                  space: {
                    sys: {
                      id: 'field a space id'
                    }
                  }
                },
                fields: {
                  file: {
                    url: 'TEST URL',
                    title: 'TEST TITLE'
                  },
                  description: 'TEST DECSRIPTION'
                }
              }
            ]
          }
        }
      ],
      includes: {}
    };

    const expected = {
      fieldA: [
        {
          id: 'field a id',
          cmsType: 'asset',
          spaceId: 'field a space id',
          description: 'TEST DECSRIPTION',
          title: 'TEST TITLE',
          url: 'TEST URL'
        }
      ],
      id: 'root id',
      cmsType: 'element',
      spaceId: 'space id',
      type: 'root type'
    };

    expect(service._mapContentfulElementToObject(input as EntryCollection<any>, input.items!![0])).toEqual(expected);
  });

  it('throws if unknown type', () => {
    const service = mockService();

    const input: DeepPartial<EntryCollection<any>> = {
      items: [
        {
          sys: {
            id: 'root id',
            type: 'UNKNOWN',
            contentType: {
              sys: {
                id: 'root type'
              }
            },
            space: {
              sys: {
                id: 'space id'
              }
            }
          },
          fields: {}
        }
      ],
      includes: {}
    };

    expect(() => service._mapContentfulElementToObject(input as EntryCollection<any>, input.items!![0])).toThrow(
      'unknown cms type UNKNOWN'
    );
  });

  it('ignores entries that cannot be found', () => {
    const service = mockService();

    const input: any = {
      items: [
        {
          sys: {
            id: 'root id',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'root type'
              }
            },
            space: {
              sys: {
                id: 'space id'
              }
            }
          },
          fields: {
            fieldA: [
              {
                sys: {
                  id: 'field a id',
                  linkType: 'entry',
                  contentType: {
                    sys: {
                      id: 'field a type'
                    }
                  },
                  space: {
                    sys: {
                      id: 'field a space id'
                    }
                  }
                }
              }
            ],
            fieldB: {
              sys: {
                id: 'field a id',
                linkType: 'entry',
                contentType: {
                  sys: {
                    id: 'field a type'
                  }
                },
                space: {
                  sys: {
                    id: 'field a space id'
                  }
                }
              }
            }
          }
        }
      ],
      includes: {
        entry: []
      }
    };

    const expected = {
      cmsType: 'element',
      fieldA: [],
      fieldB: null,
      id: 'root id',
      spaceId: 'space id',
      type: 'root type'
    };

    expect(service._mapContentfulElementToObject(input as EntryCollection<any>, input.items!![0])).toEqual(expected);
    expect(logHandledError).toHaveBeenCalledWith(expect.anything());
  });
});
