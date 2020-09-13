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
});

export const ClassificationDocument = (data: Chart[]) => (
  <Document author="Francisco Jiménez Aguilera" title={"Classification charts"}>
    <Page size="A4" style={styles.page}>
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
