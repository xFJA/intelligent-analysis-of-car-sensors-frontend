import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Chart } from "../../models/pdf";
import { PredictionInformationList } from "../../models/prediction";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    flex: 1,
    padding: 10,
  },
  section: {
    flexGrow: 1,
  },
  image: { marginHorizontal: 100 },
  title: {
    textAlign: "center",
    fontSize: 16,
  },
  description: {
    textAlign: "center",
    fontSize: 13,
  },
  predictionInformationTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  predictionInformationItemTitle: {
    fontSize: 14,
  },
  predictionInformationItemValue: {
    fontSize: 14,
    color: "#8c8c8c",
    marginLeft: 5,
  },
  predictionInformationSection: {
    marginBottom: 50,
  },
  predictionInformationItem: {
    flexDirection: "row",
    display: "flex",
  },
});

interface Props {
  title: string;
  data: Chart[];
  predictionInformation?: PredictionInformationList[];
}

export const DocumentPDF: React.FC<Props> = (props) => {
  const { title, data, predictionInformation } = props;

  return (
    <Document author="Francisco Jiménez Aguilera" title={title}>
      <Page size="A4" style={styles.page}>
        {predictionInformation && (
          <>
            {predictionInformation.map((p) => {
              return (
                <View style={styles.predictionInformationSection}>
                  <Text style={styles.predictionInformationTitle}>
                    {p.title}
                  </Text>
                  <View>
                    {p.list.map((l) => {
                      return (
                        <View style={styles.predictionInformationItem}>
                          <Text style={styles.predictionInformationItemTitle}>
                            {`${l.title}: `}
                          </Text>
                          <Text style={styles.predictionInformationItemValue}>
                            {l.value}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </>
        )}
        {data.map((c) => {
          return (
            <View style={styles.section}>
              <Text style={styles.title}>{c.title}</Text>
              <Text style={styles.description}>{c.description}</Text>
              <Image src={c.chart} style={styles.image} />
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
