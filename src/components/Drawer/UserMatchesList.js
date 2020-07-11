import React, { useContext, useState, useEffect } from 'react';
import * as style from './Drawer.module.scss';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MarkersContext } from '../../providers/MapMarkersProvider';
import { UserDetailsContext } from '../../providers/UserDetailsProvider';
import { Divider, Chip } from '@material-ui/core';
import { LostOrFoundLabel, DrawersTitle } from './UserSettings';

export const AnimatedItem = ({ pos, children }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  useEffect(() => {
    const animationId = setTimeout(() => setShouldAnimate(true), pos * 200);
    return () => clearTimeout(animationId);
  }, []);
  return (
    <div className={`${style.defualt} ${shouldAnimate ? style.animate : ''}`}>
      {children}
    </div>
  );
};

export const UserMatchesList = () => {
  const { markers, setCenter } = useContext(MarkersContext);
  const { userDetails } = useContext(UserDetailsContext);

  const getUserMatches = () => {
    return markers.filter(
      (m) => m.reporter.id === userDetails.googleId && m.matches.length > 0
    );
  };

  const getEntryById = (id) => markers.find((m) => m._id === id);

  if (!getUserMatches().length) {
    return (
      <div className={style.matches}>
        <DrawersTitle pageName="User Matches" />
        <Typography align="center" variant="h3" style={{ marginTop: '20px' }}>
          No Matches!
        </Typography>
      </div>
    );
  }
  return (
    <div className={style.matches}>
      <DrawersTitle pageName="User Matches" />
      {getUserMatches().map((m, i) => {
        return (
          <AnimatedItem pos={i} key={i}>
            <ExpansionPanel className={style.matchPanel}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <>
                  <div className={style.flex}>
                    <LostOrFoundLabel type={m.entryType} />
                    <Chip
                      key="sa"
                      className={`${style.scoreLabel} ${style.matcheNo}`}
                      label={`${m.matches.length} POSSIBLE MATCHES`}
                    ></Chip>
                    <Labels labels={m.labels} />
                  </div>
                </>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ display: 'block' }}>
                <div style={{ marginBottom: '15px' }}>
                  <Typography align="left" variant="h5">
                    Entry description
                  </Typography>

                  <Typography align="left">{m.description}</Typography>
                </div>
                <Typography align="left" variant="h5">
                  Matches
                </Typography>

                {[...m.matches]
                  .sort((a, b) => a.score - b.score)
                  .reverse()
                  .map((match) => (
                    <>
                      <div className={style.matchContainer}>
                        <div className={style.matchLabels}>
                          <Chip
                            className={style.scoreLabel}
                            label={`MATCH SCORE: ${match.score}`}
                          ></Chip>
                          <a
                            href={`mailto:${
                              getEntryById(match.matchedWithEntryId).reporter
                                .email
                            }`}
                            className={style.email}
                          >
                            <Button
                              align="left"
                              variant="contained"
                              color="secondary"
                            >
                              Contact reporter
                            </Button>
                          </a>
                          <Button
                            align="left"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setCenter(match.location);
                            }}
                          >
                            Go to match
                          </Button>
                        </div>
                        <Typography
                          align="left"
                          style={{ fontWeight: 'bold', marginTop: '10px' }}
                        >
                          Reporter Email
                        </Typography>
                        <Typography align="left">
                          {
                            getEntryById(match.matchedWithEntryId).reporter
                              .email
                          }
                        </Typography>
                        <Typography
                          align="left"
                          style={{ fontWeight: 'bold', marginTop: '10px' }}
                        >
                          Match description
                        </Typography>
                        <Typography align="left">
                          {getEntryById(match.matchedWithEntryId)
                            ? getEntryById(match.matchedWithEntryId).description
                            : 'No Description'}
                        </Typography>
                        <Typography
                          align="left"
                          style={{
                            fontWeight: 'bold',
                            marginTop: '10px',
                            marginBottom: '5px',
                          }}
                        >
                          Match labels
                        </Typography>
                        <Typography align="left">
                          <Labels
                            labels={
                              getEntryById(match.matchedWithEntryId).labels
                            }
                          />
                        </Typography>
                      </div>
                      <Divider />
                    </>
                  ))}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </AnimatedItem>
        );
      })}
    </div>
  );
};

export const Labels = ({ labels }) => {
  const toLabel = (l) => {
    return <Chip key={l} className={style.l} label={l.toUpperCase()}></Chip>;
  };
  return labels.filter(Boolean).map(toLabel);
};
